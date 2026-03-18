package datart.server.controller;

import datart.server.base.dto.ResponseData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 脱敏规则管理 Controller
 * 提供脱敏规则 CRUD 和查询接口
 */
@Api(tags = "Masking Rule Management")
@RestController
@RequestMapping("/api/masking-rule")
public class MaskingRuleController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @ApiOperation("获取脱敏规则列表")
    @GetMapping
    public ResponseData<List<Map<String, Object>>> listMaskingRules(
            @RequestParam(required = false) String orgId,
            @RequestParam(required = false) String maskType,
            @RequestParam(required = false) String ruleType) {
        StringBuilder sql = new StringBuilder("SELECT * FROM masking_rule WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (orgId != null && !orgId.isEmpty()) {
            sql.append(" AND (org_id = ? OR org_id IS NULL)");
            params.add(orgId);
        }
        if (maskType != null && !maskType.isEmpty()) {
            sql.append(" AND mask_type = ?");
            params.add(maskType);
        }
        if (ruleType != null && !ruleType.isEmpty()) {
            sql.append(" AND rule_type = ?");
            params.add(ruleType);
        }
        sql.append(" ORDER BY rule_type ASC, create_time DESC");

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql.toString(), params.toArray());
        return ResponseData.success(results);
    }

    @ApiOperation("获取内置脱敏规则")
    @GetMapping("/builtin")
    public ResponseData<List<Map<String, Object>>> getBuiltinRules() {
        List<Map<String, Object>> results = jdbcTemplate.queryForList(
                "SELECT * FROM masking_rule WHERE rule_type = 'BUILTIN' ORDER BY mask_type");
        return ResponseData.success(results);
    }

    @ApiOperation("获取脱敏类型列表")
    @GetMapping("/types")
    public ResponseData<List<Map<String, String>>> getMaskingTypes() {
        List<Map<String, String>> types = new ArrayList<>();
        types.add(createType("PHONE", "手机号脱敏", "手机号中间4位用*替代"));
        types.add(createType("EMAIL", "邮箱脱敏", "邮箱用户名部分隐藏"));
        types.add(createType("IDCARD", "身份证脱敏", "身份证号中间8位用*替代"));
        types.add(createType("NAME", "姓名脱敏", "姓名仅保留姓氏"));
        types.add(createType("BANKCARD", "银行卡脱敏", "银行卡号仅保留前4后4位"));
        types.add(createType("ADDRESS", "地址脱敏", "详细地址部分隐藏"));
        types.add(createType("CUSTOM", "自定义脱敏", "自定义正则替换规则"));
        return ResponseData.success(types);
    }

    private Map<String, String> createType(String code, String name, String description) {
        Map<String, String> type = new HashMap<>();
        type.put("code", code);
        type.put("name", name);
        type.put("description", description);
        return type;
    }

    @ApiOperation("获取单个脱敏规则")
    @GetMapping("/{id}")
    public ResponseData<Map<String, Object>> getMaskingRule(@PathVariable String id) {
        List<Map<String, Object>> results = jdbcTemplate.queryForList(
                "SELECT * FROM masking_rule WHERE id = ?", id);
        if (results.isEmpty()) {
            return ResponseData.failure("Masking rule not found: " + id);
        }
        return ResponseData.success(results.get(0));
    }

    @ApiOperation("创建脱敏规则")
    @PostMapping
    public ResponseData<Map<String, Object>> createMaskingRule(@RequestBody Map<String, Object> body) {
        String id = UUID.randomUUID().toString().replace("-", "");
        String name = (String) body.get("name");
        String orgId = (String) body.get("orgId");
        String maskType = (String) body.getOrDefault("maskType", "CUSTOM");
        String ruleTypeVal = (String) body.getOrDefault("ruleType", "CUSTOM");
        String pattern = (String) body.get("pattern");
        String replacement = (String) body.get("replacement");
        String description = (String) body.get("description");

        jdbcTemplate.update(
                "INSERT INTO masking_rule (id, name, org_id, mask_type, rule_type, pattern, replacement, description, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
                id, name, orgId, maskType, ruleTypeVal, pattern, replacement, description);

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("name", name);
        result.put("orgId", orgId);
        result.put("maskType", maskType);
        result.put("ruleType", ruleTypeVal);
        result.put("pattern", pattern);
        result.put("replacement", replacement);
        result.put("description", description);
        return ResponseData.success(result);
    }

    @ApiOperation("更新脱敏规则")
    @PutMapping("/{id}")
    public ResponseData<Boolean> updateMaskingRule(@PathVariable String id, @RequestBody Map<String, Object> body) {
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT * FROM masking_rule WHERE id = ?", id);
        if (existing.isEmpty()) {
            return ResponseData.failure("Masking rule not found: " + id);
        }

        // Prevent modifying built-in rules
        if ("BUILTIN".equals(existing.get(0).get("rule_type"))) {
            return ResponseData.failure("Cannot modify built-in masking rules");
        }

        StringBuilder sql = new StringBuilder("UPDATE masking_rule SET update_time = NOW()");
        List<Object> params = new ArrayList<>();

        if (body.containsKey("name")) {
            sql.append(", name = ?");
            params.add(body.get("name"));
        }
        if (body.containsKey("maskType")) {
            sql.append(", mask_type = ?");
            params.add(body.get("maskType"));
        }
        if (body.containsKey("pattern")) {
            sql.append(", pattern = ?");
            params.add(body.get("pattern"));
        }
        if (body.containsKey("replacement")) {
            sql.append(", replacement = ?");
            params.add(body.get("replacement"));
        }
        if (body.containsKey("description")) {
            sql.append(", description = ?");
            params.add(body.get("description"));
        }
        sql.append(" WHERE id = ?");
        params.add(id);

        jdbcTemplate.update(sql.toString(), params.toArray());
        return ResponseData.success(true);
    }

    @ApiOperation("删除脱敏规则")
    @DeleteMapping("/{id}")
    public ResponseData<Boolean> deleteMaskingRule(@PathVariable String id) {
        // Prevent deleting built-in rules
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT * FROM masking_rule WHERE id = ?", id);
        if (!existing.isEmpty() && "BUILTIN".equals(existing.get(0).get("rule_type"))) {
            return ResponseData.failure("Cannot delete built-in masking rules");
        }

        int affected = jdbcTemplate.update("DELETE FROM masking_rule WHERE id = ?", id);
        return ResponseData.success(affected > 0);
    }

    @ApiOperation("预览脱敏效果")
    @PostMapping("/preview")
    public ResponseData<Map<String, Object>> previewMasking(@RequestBody Map<String, Object> body) {
        String ruleId = (String) body.get("ruleId");
        String sampleData = (String) body.get("sampleData");

        Map<String, Object> result = new HashMap<>();
        result.put("original", sampleData);

        if (ruleId != null) {
            List<Map<String, Object>> rules = jdbcTemplate.queryForList(
                    "SELECT * FROM masking_rule WHERE id = ?", ruleId);
            if (!rules.isEmpty()) {
                String pattern = (String) rules.get(0).get("pattern");
                String replacement = (String) rules.get(0).get("replacement");
                if (pattern != null && replacement != null && sampleData != null) {
                    try {
                        String masked = sampleData.replaceAll(pattern, replacement);
                        result.put("masked", masked);
                        result.put("ruleApplied", true);
                    } catch (Exception e) {
                        result.put("masked", sampleData);
                        result.put("ruleApplied", false);
                        result.put("error", "Invalid regex pattern: " + e.getMessage());
                    }
                } else {
                    result.put("masked", sampleData);
                    result.put("ruleApplied", false);
                }
                result.put("rule", rules.get(0));
            } else {
                result.put("masked", sampleData);
                result.put("ruleApplied", false);
                result.put("error", "Rule not found");
            }
        } else {
            result.put("masked", sampleData);
            result.put("ruleApplied", false);
        }

        return ResponseData.success(result);
    }
}
