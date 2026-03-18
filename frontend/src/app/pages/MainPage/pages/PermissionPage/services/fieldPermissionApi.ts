/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { request2 } from 'utils/request';
import {
  FieldPermission,
  FieldPermissionSetting,
  MaskingRule,
  PermissionInheritance,
} from '../types';

// 字段权限相关API
export const getFieldPermissions = async (viewId: string) => {
  const { data } = await request2<FieldPermission[]>({
    url: `/view/${viewId}/field/permissions`,
    method: 'GET',
  });
  return data;
};

export const updateFieldPermissions = async (viewId: string, permissions: FieldPermission[]) => {
  const { data } = await request2<boolean>({
    url: `/view/${viewId}/field/permissions`,
    method: 'POST',
    data: permissions,
  });
  return data;
};

export const getMaskingRules = async (orgId: string) => {
  const { data } = await request2<MaskingRule[]>({
    url: `/organization/${orgId}/masking/rules`,
    method: 'GET',
  });
  return data;
};

export const createMaskingRule = async (rule: MaskingRule) => {
  const { data } = await request2<MaskingRule>({
    url: `/organization/masking/rules`,
    method: 'POST',
    data: rule,
  });
  return data;
};

export const updateMaskingRule = async (ruleId: string, rule: Partial<MaskingRule>) => {
  const { data } = await request2<MaskingRule>({
    url: `/organization/masking/rules/${ruleId}`,
    method: 'PUT',
    data: rule,
  });
  return data;
};

export const deleteMaskingRule = async (ruleId: string) => {
  const { data } = await request2<boolean>({
    url: `/organization/masking/rules/${ruleId}`,
    method: 'DELETE',
  });
  return data;
};

export const getFieldPermissionSettings = async (viewId: string) => {
  const { data } = await request2<FieldPermissionSetting>({
    url: `/view/${viewId}/field/permission/settings`,
    method: 'GET',
  });
  return data;
};

export const updateFieldPermissionSettings = async (
  viewId: string,
  settings: FieldPermissionSetting
) => {
  const { data } = await request2<boolean>({
    url: `/view/${viewId}/field/permission/settings`,
    method: 'POST',
    data: settings,
  });
  return data;
};

export const getPermissionInheritance = async (orgId: string) => {
  const { data } = await request2<PermissionInheritance>({
    url: `/organization/${orgId}/permission/inheritance`,
    method: 'GET',
  });
  return data;
};

export const updatePermissionInheritance = async (
  orgId: string,
  inheritance: PermissionInheritance
) => {
  const { data } = await request2<boolean>({
    url: `/organization/${orgId}/permission/inheritance`,
    method: 'POST',
    data: inheritance,
  });
  return data;
};