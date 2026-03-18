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

import { TreeDataNode } from 'antd';
import {
  PermissionLevels,
  ResourceTypes,
  SubjectTypes,
  Viewpoints,
} from '../constants';

export interface PermissionState {
  folders: DataSourceViewModel[] | undefined;
  storyboards: DataSourceViewModel[] | undefined;
  views: DataSourceViewModel[] | undefined;
  sources: DataSourceViewModel[] | undefined;
  schedules: DataSourceViewModel[] | undefined;
  roles: DataSourceViewModel[] | undefined;
  members: DataSourceViewModel[] | undefined;
  folderListLoading: boolean;
  storyboardListLoading: boolean;
  viewListLoading: boolean;
  sourceListLoading: boolean;
  scheduleListLoading: boolean;
  roleListLoading: boolean;
  memberListLoading: boolean;
  permissions: ViewpointPermissionMap;
}

export interface ViewpointPermissionMap {
  [viewpoint: string]: {
    loading: boolean;
    permissionObject: ResourcePermissions | SubjectPermissions | undefined;
  };
}

export interface DataSourceViewModel {
  id: string;
  name: string;
  type: SubjectTypes | ResourceTypes;
  parentId: string | null;
  index: number | null;
  isFolder: boolean;
  permissionArray: PermissionLevels[];
}

export type DataSourceTreeNode = DataSourceViewModel &
  TreeDataNode & {
    path: string[];
    children?: DataSourceTreeNode[];
  };

export interface Privilege {
  id?: string;
  orgId: string;
  permission: PermissionLevels;
  resourceId: string;
  resourceType: ResourceTypes;
  subjectId: string;
  subjectType: SubjectTypes;
}

export interface ResourcePermissions {
  orgId: string;
  resourceId: string;
  resourceType: ResourceTypes;
  rolePermissions: Privilege[];
  userPermissions: Privilege[];
}

export interface SubjectPermissions {
  orgId: string;
  orgOwner?: boolean;
  subjectId: string;
  subjectType: SubjectTypes;
  permissionInfos: Privilege[];
}

export interface GetPermissionParams<T> {
  orgId: string;
  type: T;
  id: string;
}

export interface GrantPermissionParams {
  params: {
    permissionToCreate: Privilege[];
    permissionToDelete: Privilege[];
    permissionToUpdate: Privilege[];
  };
  options: {
    viewpoint: Viewpoints;
    viewpointType: ResourceTypes | SubjectTypes;
    dataSourceType: ResourceTypes | SubjectTypes;
    reserved: Privilege[];
  };
  resolve: () => void;
}

export interface SelectPrivilegesProps {
  viewpoint: Viewpoints;
  dataSourceType: ResourceTypes | SubjectTypes;
}

// 字段权限相关类型
export interface FieldPermission {
  fieldId: string;
  fieldName: string;
  visibility: 'VISIBLE' | 'HIDDEN' | 'MASKED';
  maskingRuleId?: string | null;
  maskType?: string | null;
  maskParams?: any;
}

export interface ViewField {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface FieldPermissionSetting {
  viewId: string;
  permissions: FieldPermission[];
  defaultVisibility: 'VISIBLE' | 'HIDDEN' | 'MASKED';
  defaultMaskingRule?: string;
}

export interface MaskingRule {
  id: string;
  name: string;
  maskType: string;
  description?: string;
  params?: any;
  orgId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BuiltInMaskingRuleType {
  id: string;
  name: string;
  description: string;
}

export interface InheritanceLevel {
  level: 'ORGANIZATION' | 'DEPARTMENT' | 'TEAM' | 'USER';
  enabled: boolean;
  cascades: Array<{
    type: string;
    label: string;
    enabled: boolean;
  }>;
  description: string;
}

export interface PermissionInheritance {
  orgId: string;
  levels: InheritanceLevel[];
  enableFieldLevelInheritance: boolean;
  enableMaskingRuleInheritance: boolean;
}
