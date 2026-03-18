package datart.server.controller;

import datart.server.base.dto.ResponseData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 字段级权限管理 Controller
 * 提供字段权限 CRUD 和查询接口
 */
@Api(tags = "Field Permission Management")
@RestController
@RequestMapping("/api/field-permission")
public class FieldPermissionController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @ApiOperation("获取字段权限列表")
    @GetMapping
    public ResponseData<List<Map<String, Object>>> listFieldPermissions(
            @RequestParam(required = false) String viewId,
            @RequestParam(required = false) String subjectType,
            @RequestParam(required = false) String subjectId) {
        StringBuilder sql = new StringBuilder("SELECT * FROM field_permission_config WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (viewId != null && !viewId.isEmpty()) {
            sql.append(" AND view_id = ?");
            params.add(viewId);
        }
        if (subjectType != null && !subjectType.isEmpty()) {
            sql.append(" AND subject_type = ?");
            params.add(subjectType);
        }
        if (subjectId != null && !subjectId.isEmpty()) {
            sql.append(" AND subject_id = ?");
            params.add(subjectId);
        }
        sql.append(" ORDER BY priority DESC, create_time DESC");

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql.toString(), params.toArray());
        return ResponseData.success(results);
    }

    @ApiOperation("获取单个字段权限配置")
    @GetMapping("/{id}")
    public ResponseData<Map<String, Object>> getFieldPermission(@PathVariable String id) {
        List<Map<String, Object>> results = jdbcTemplate.queryForList(
                "SELECT * FROM field_permission_config WHERE id = ?", id);
        if (results.isEmpty()) {
            return ResponseData.failure("Field permission config not found: " + id);
        }
        return ResponseData.success(results.get(0));
    }

    @ApiOperation("创建字段权限配置")
    @PostMapping
    public ResponseData<Map<String, Object>> createFieldPermission(@RequestBody Map<String, Object> body) {
        String id = UUID.randomUUID().toString().replace("-", "");
        String viewId = (String) body.get("viewId");
        String fieldId = (String) body.get("fieldId");
        String subjectType = (String) body.getOrDefault("subjectType", "USER");
        String subjectId = (String) body.get("subjectId");
        String visibility = (String) body.getOrDefault("visibility", "VISIBLE");
        String maskingRuleId = (String) body.get("maskingRuleId");
        Integer priority = body.get("priority") != null ? Integer.parseInt(body.get("priority").toString()) : 10;

        jdbcTemplate.update(
                "INSERT INTO field_permission_config (id, view_id, field_id, subject_type, subject_id, visibility, masking_rule_id, priority, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
                id, viewId, fieldId, subjectType, subjectId, visibility, maskingRuleId, priority);

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("viewId", viewId);
        result.put("fieldId", fieldId);
        result.put("subjectType", subjectType);
        result.put("subjectId", subjectId);
        result.put("visibility", visibility);
        result.put("maskingRuleId", maskingRuleId);
        result.put("priority", priority);
        return ResponseData.success(result);
    }

    @ApiOperation("更新字段权限配置")
    @PutMapping("/{id}")
    public ResponseData<Boolean> updateFieldPermission(@PathVariable String id, @RequestBody Map<String, Object> body) {
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT * FROM field_permission_config WHERE id = ?", id);
        if (existing.isEmpty()) {
            return ResponseData.failure("Field permission config not found: " + id);
        }

        StringBuilder sql = new StringBuilder("UPDATE field_permission_config SET update_time = NOW()");
        List<Object> params = new ArrayList<>();

        if (body.containsKey("visibility")) {
            sql.append(", visibility = ?");
            params.add(body.get("visibility"));
        }
        if (body.containsKey("maskingRuleId")) {
            sql.append(", masking_rule_id = ?");
            params.add(body.get("maskingRuleId"));
        }
        if (body.containsKey("priority")) {
            sql.append(", priority = ?");
            params.add(Integer.parseInt(body.get("priority").toString()));
        }
        sql.append(" WHERE id = ?");
        params.add(id);

        jdbcTemplate.update(sql.toString(), params.toArray());
        return ResponseData.success(true);
    }

    @ApiOperation("删除字段权限配置")
    @DeleteMapping("/{id}")
    public ResponseData<Boolean> deleteFieldPermission(@PathVariable String id) {
        int affected = jdbcTemplate.update("DELETE FROM field_permission_config WHERE id = ?", id);
        return ResponseData.success(affected > 0);
    }

    @ApiOperation("批量创建字段权限配置")
    @PostMapping("/batch")
    public ResponseData<Integer> batchCreateFieldPermissions(@RequestBody List<Map<String, Object>> configs) {
        int count = 0;
        for (Map<String, Object> body : configs) {
            String id = UUID.randomUUID().toString().replace("-", "");
            jdbcTemplate.update(
                    "INSERT INTO field_permission_config (id, view_id, field_id, subject_type, subject_id, visibility, masking_rule_id, priority, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
                    id,
                    body.get("viewId"),
                    body.get("fieldId"),
                    body.getOrDefault("subjectType", "USER"),
                    body.get("subjectId"),
                    body.getOrDefault("visibility", "VISIBLE"),
                    body.get("maskingRuleId"),
                    body.get("priority") != null ? Integer.parseInt(body.get("priority").toString()) : 10);
            count++;
        }
        return ResponseData.success(count);
    }

    @ApiOperation("检查字段访问权限")
    @PostMapping("/check")
    public ResponseData<Map<String, Object>> checkFieldPermission(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String viewId = (String) body.get("viewId");
        String fieldId = (String) body.get("fieldId");

        // 先查用户级权限（优先级最高）
        List<Map<String, Object>> userPerms = jdbcTemplate.queryForList(
                "SELECT * FROM field_permission_config WHERE view_id = ? AND field_id = ? AND subject_type = 'USER' AND subject_id = ? ORDER BY priority DESC LIMIT 1",
                viewId, fieldId, userId);

        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("viewId", viewId);
        result.put("fieldId", fieldId);

        if (!userPerms.isEmpty()) {
            result.put("visibility", userPerms.get(0).get("visibility"));
            result.put("source", "USER");
            result.put("configId", userPerms.get(0).get("id"));
        } else {
            // 默认可见
            result.put("visibility", "VISIBLE");
            result.put("source", "DEFAULT");
            result.put("configId", null);
        }

        return ResponseData.success(result);
    }
}
