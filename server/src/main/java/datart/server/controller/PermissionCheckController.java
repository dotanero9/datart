package datart.server.controller;

import datart.server.base.dto.ResponseData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 统一权限检查 Controller
 * 提供字段级权限检查和权限预览接口
 */
@Api(tags = "Permission Check")
@RestController
@RequestMapping("/api/permission")
public class PermissionCheckController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @ApiOperation("批量检查字段权限")
    @PostMapping("/check")
    public ResponseData<Map<String, Object>> checkPermissions(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String viewId = (String) body.get("viewId");
        @SuppressWarnings("unchecked")
        List<String> fieldIds = (List<String>) body.get("fieldIds");

        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("viewId", viewId);

        List<Map<String, Object>> fieldResults = new ArrayList<>();

        if (fieldIds != null) {
            for (String fieldId : fieldIds) {
                Map<String, Object> fieldResult = checkSingleFieldPermission(userId, viewId, fieldId);
                fieldResults.add(fieldResult);
            }
        }

        result.put("fields", fieldResults);
        result.put("checkedAt", new Date().toString());
        return ResponseData.success(result);
    }

    @ApiOperation("检查单个字段权限")
    @GetMapping("/check/field")
    public ResponseData<Map<String, Object>> checkSingleField(
            @RequestParam String userId,
            @RequestParam String viewId,
            @RequestParam String fieldId) {
        return ResponseData.success(checkSingleFieldPermission(userId, viewId, fieldId));
    }

    private Map<String, Object> checkSingleFieldPermission(String userId, String viewId, String fieldId) {
        Map<String, Object> result = new HashMap<>();
        result.put("fieldId", fieldId);

        // Check user-level permission first (highest priority)
        List<Map<String, Object>> userPerms = jdbcTemplate.queryForList(
                "SELECT * FROM field_permission_config WHERE view_id = ? AND field_id = ? AND subject_type = 'USER' AND subject_id = ? ORDER BY priority DESC LIMIT 1",
                viewId, fieldId, userId);

        if (!userPerms.isEmpty()) {
            Map<String, Object> perm = userPerms.get(0);
            result.put("visibility", perm.get("visibility"));
            result.put("source", "USER");
            result.put("maskingRuleId", perm.get("masking_rule_id"));

            // If masked, include masking rule details
            if ("MASKED".equals(perm.get("visibility")) && perm.get("masking_rule_id") != null) {
                List<Map<String, Object>> rules = jdbcTemplate.queryForList(
                        "SELECT * FROM masking_rule WHERE id = ?", perm.get("masking_rule_id"));
                if (!rules.isEmpty()) {
                    result.put("maskingRule", rules.get(0));
                }
            }
        } else {
            // Check role-level permissions
            List<Map<String, Object>> rolePerms = jdbcTemplate.queryForList(
                    "SELECT fpc.* FROM field_permission_config fpc " +
                    "INNER JOIN rel_role_user rru ON fpc.subject_id = rru.role_id " +
                    "WHERE fpc.view_id = ? AND fpc.field_id = ? AND fpc.subject_type = 'ROLE' AND rru.user_id = ? " +
                    "ORDER BY fpc.priority DESC LIMIT 1",
                    viewId, fieldId, userId);

            if (!rolePerms.isEmpty()) {
                Map<String, Object> perm = rolePerms.get(0);
                result.put("visibility", perm.get("visibility"));
                result.put("source", "ROLE");
                result.put("maskingRuleId", perm.get("masking_rule_id"));
            } else {
                // Default: visible
                result.put("visibility", "VISIBLE");
                result.put("source", "DEFAULT");
                result.put("maskingRuleId", null);
            }
        }

        return result;
    }

    @ApiOperation("获取用户在视图中的所有字段权限概览")
    @GetMapping("/overview")
    public ResponseData<Map<String, Object>> getPermissionOverview(
            @RequestParam String userId,
            @RequestParam String viewId) {

        // Get all field permission configs for this view
        List<Map<String, Object>> allConfigs = jdbcTemplate.queryForList(
                "SELECT * FROM field_permission_config WHERE view_id = ? ORDER BY field_id, priority DESC",
                viewId);

        // Get user-specific configs
        List<Map<String, Object>> userConfigs = jdbcTemplate.queryForList(
                "SELECT * FROM field_permission_config WHERE view_id = ? AND subject_type = 'USER' AND subject_id = ?",
                viewId, userId);

        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("viewId", viewId);
        result.put("totalConfigs", allConfigs.size());
        result.put("userSpecificConfigs", userConfigs.size());
        result.put("configs", allConfigs);
        return ResponseData.success(result);
    }
}
