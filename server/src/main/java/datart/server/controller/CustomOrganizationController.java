package datart.server.controller;

import datart.server.base.dto.ResponseData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 自定义组织架构管理 Controller
 * 提供组织树 CRUD、用户-组织关联接口
 * 
 * 注意：Datart 原生组织 API 在 /api/v1/orgs (OrgController)
 * 本 Controller 提供扩展的组织架构树管理功能
 */
@Api(tags = "Organization Management (Extended)")
@RestController
@RequestMapping("/api/organizations")
public class CustomOrganizationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ========== 组织架构 CRUD ==========

    @ApiOperation("获取组织架构树")
    @GetMapping("/tree")
    public ResponseData<List<Map<String, Object>>> getOrganizationTree(
            @RequestParam(required = false) String orgId) {
        List<Map<String, Object>> allOrgs;
        if (orgId != null && !orgId.isEmpty()) {
            allOrgs = jdbcTemplate.queryForList(
                    "SELECT * FROM custom_organization WHERE org_id = ? ORDER BY sort_order, create_time", orgId);
        } else {
            allOrgs = jdbcTemplate.queryForList(
                    "SELECT * FROM custom_organization ORDER BY sort_order, create_time");
        }

        // Build tree structure
        List<Map<String, Object>> tree = buildTree(allOrgs, null);
        return ResponseData.success(tree);
    }

    private List<Map<String, Object>> buildTree(List<Map<String, Object>> allOrgs, String parentId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> org : allOrgs) {
            String pid = (String) org.get("parent_id");
            boolean isMatch = (parentId == null && (pid == null || pid.isEmpty()))
                    || (parentId != null && parentId.equals(pid));
            if (isMatch) {
                Map<String, Object> node = new HashMap<>(org);
                node.put("children", buildTree(allOrgs, (String) org.get("id")));
                result.add(node);
            }
        }
        return result;
    }

    @ApiOperation("获取组织列表")
    @GetMapping
    public ResponseData<List<Map<String, Object>>> listOrganizations(
            @RequestParam(required = false) String orgId) {
        if (orgId != null && !orgId.isEmpty()) {
            return ResponseData.success(jdbcTemplate.queryForList(
                    "SELECT * FROM custom_organization WHERE org_id = ? ORDER BY sort_order, create_time", orgId));
        }
        return ResponseData.success(jdbcTemplate.queryForList(
                "SELECT * FROM custom_organization ORDER BY sort_order, create_time"));
    }

    @ApiOperation("获取子组织")
    @GetMapping("/{id}/children")
    public ResponseData<List<Map<String, Object>>> getChildren(@PathVariable String id) {
        List<Map<String, Object>> children = jdbcTemplate.queryForList(
                "SELECT * FROM custom_organization WHERE parent_id = ? ORDER BY sort_order", id);
        return ResponseData.success(children);
    }

    @ApiOperation("获取单个组织详情")
    @GetMapping("/{id}")
    public ResponseData<Map<String, Object>> getOrganization(@PathVariable String id) {
        // Prevent matching /tree path
        if ("tree".equals(id)) {
            return ResponseData.success(null);
        }
        List<Map<String, Object>> results = jdbcTemplate.queryForList(
                "SELECT * FROM custom_organization WHERE id = ?", id);
        if (results.isEmpty()) {
            return ResponseData.failure("Organization not found: " + id);
        }
        return ResponseData.success(results.get(0));
    }

    @ApiOperation("创建组织")
    @PostMapping
    public ResponseData<Map<String, Object>> createOrganization(@RequestBody Map<String, Object> body) {
        String id = UUID.randomUUID().toString().replace("-", "");
        String name = (String) body.get("name");
        String parentId = (String) body.get("parentId");
        String orgId = (String) body.get("orgId");
        Integer sortOrder = body.get("sortOrder") != null ? Integer.parseInt(body.get("sortOrder").toString()) : 0;
        String description = (String) body.get("description");

        jdbcTemplate.update(
                "INSERT INTO custom_organization (id, name, parent_id, org_id, sort_order, description, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
                id, name, parentId, orgId, sortOrder, description);

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("name", name);
        result.put("parentId", parentId);
        result.put("orgId", orgId);
        result.put("sortOrder", sortOrder);
        result.put("description", description);
        return ResponseData.success(result);
    }

    @ApiOperation("更新组织")
    @PutMapping("/{id}")
    public ResponseData<Boolean> updateOrganization(@PathVariable String id, @RequestBody Map<String, Object> body) {
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT * FROM custom_organization WHERE id = ?", id);
        if (existing.isEmpty()) {
            return ResponseData.failure("Organization not found: " + id);
        }

        StringBuilder sql = new StringBuilder("UPDATE custom_organization SET update_time = NOW()");
        List<Object> params = new ArrayList<>();

        if (body.containsKey("name")) {
            sql.append(", name = ?");
            params.add(body.get("name"));
        }
        if (body.containsKey("parentId")) {
            sql.append(", parent_id = ?");
            params.add(body.get("parentId"));
        }
        if (body.containsKey("sortOrder")) {
            sql.append(", sort_order = ?");
            params.add(Integer.parseInt(body.get("sortOrder").toString()));
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

    @ApiOperation("删除组织")
    @DeleteMapping("/{id}")
    public ResponseData<Boolean> deleteOrganization(@PathVariable String id) {
        // Check for children
        List<Map<String, Object>> children = jdbcTemplate.queryForList(
                "SELECT id FROM custom_organization WHERE parent_id = ?", id);
        if (!children.isEmpty()) {
            return ResponseData.failure("Cannot delete organization with children. Delete children first.");
        }

        // Remove user associations
        jdbcTemplate.update("DELETE FROM user_custom_organization WHERE custom_org_id = ?", id);
        // Delete org
        int affected = jdbcTemplate.update("DELETE FROM custom_organization WHERE id = ?", id);
        return ResponseData.success(affected > 0);
    }

    // ========== 用户-组织关联 ==========

    @ApiOperation("关联用户到组织")
    @PostMapping("/user-bindding")
    public ResponseData<Map<String, Object>> bindUserToOrganization(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String customOrgId = (String) body.get("customOrgId");
        String id = UUID.randomUUID().toString().replace("-", "");

        // Check if already bound
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT * FROM user_custom_organization WHERE user_id = ? AND custom_org_id = ?",
                userId, customOrgId);
        if (!existing.isEmpty()) {
            return ResponseData.success(existing.get(0));
        }

        jdbcTemplate.update(
                "INSERT INTO user_custom_organization (id, user_id, custom_org_id, create_time) VALUES (?, ?, ?, NOW())",
                id, userId, customOrgId);

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("userId", userId);
        result.put("customOrgId", customOrgId);
        return ResponseData.success(result);
    }

    @ApiOperation("解除用户与组织的关联")
    @DeleteMapping("/user-bindding")
    public ResponseData<Boolean> unbindUserFromOrganization(
            @RequestParam String userId, @RequestParam String customOrgId) {
        int affected = jdbcTemplate.update(
                "DELETE FROM user_custom_organization WHERE user_id = ? AND custom_org_id = ?",
                userId, customOrgId);
        return ResponseData.success(affected > 0);
    }

    @ApiOperation("查询组织下的用户")
    @GetMapping("/{id}/users")
    public ResponseData<List<Map<String, Object>>> getOrganizationUsers(@PathVariable String id) {
        List<Map<String, Object>> users = jdbcTemplate.queryForList(
                "SELECT uco.*, u.username, u.name, u.email FROM user_custom_organization uco " +
                "LEFT JOIN `user` u ON uco.user_id = u.id " +
                "WHERE uco.custom_org_id = ?", id);
        return ResponseData.success(users);
    }

    @ApiOperation("查询用户所属的组织")
    @GetMapping("/user/{userId}")
    public ResponseData<List<Map<String, Object>>> getUserOrganizations(@PathVariable String userId) {
        List<Map<String, Object>> orgs = jdbcTemplate.queryForList(
                "SELECT co.* FROM custom_organization co " +
                "INNER JOIN user_custom_organization uco ON co.id = uco.custom_org_id " +
                "WHERE uco.user_id = ? ORDER BY co.sort_order", userId);
        return ResponseData.success(orgs);
    }
}
