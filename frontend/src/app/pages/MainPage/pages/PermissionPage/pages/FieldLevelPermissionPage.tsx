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

import { Tabs } from 'antd';
import React, { useState } from 'react';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import styled from 'styled-components/macro';
import { FieldPermissionConfig } from './components/FieldPermissionConfig';
import { PermissionInheritance } from './components/PermissionInheritance';
import { ViewField, FieldPermission } from './types';

const { TabPane } = Tabs;

interface FieldLevelPermissionPageProps {
  orgId: string;
  viewId: string;
}

export const FieldLevelPermissionPage: React.FC<FieldLevelPermissionPageProps> = ({
  orgId,
  viewId,
}) => {
  const t = useI18NPrefix('permission.fieldLevel');
  const [fields] = useState<ViewField[]>([
    { id: 'field1', name: '姓名', type: 'STRING' },
    { id: 'field2', name: '邮箱', type: 'STRING' },
    { id: 'field3', name: '手机号', type: 'STRING' },
    { id: 'field4', name: '身份证号', type: 'STRING' },
    { id: 'field5', name: '薪资', type: 'NUMBER' },
    { id: 'field6', name: '入职日期', type: 'DATE' },
  ]);
  
  const [permissions, setPermissions] = useState<FieldPermission[]>([
    { 
      fieldId: 'field1', 
      fieldName: '姓名', 
      visibility: 'VISIBLE' 
    },
    { 
      fieldId: 'field2', 
      fieldName: '邮箱', 
      visibility: 'MASKED',
      maskType: 'MASKING_SHOW_FIRST_N',
      maskParams: { count: 2 }
    },
    { 
      fieldId: 'field3', 
      fieldName: '手机号', 
      visibility: 'MASKED',
      maskType: 'MASKING_MASK_CENTER_N',
      maskParams: { headCount: 3, tailCount: 2, maskChar: '*' }
    },
    { 
      fieldId: 'field4', 
      fieldName: '身份证号', 
      visibility: 'HIDDEN'
    },
    { 
      fieldId: 'field5', 
      fieldName: '薪资', 
      visibility: 'VISIBLE' 
    },
    { 
      fieldId: 'field6', 
      fieldName: '入职日期', 
      visibility: 'VISIBLE' 
    },
  ]);

  const handleSavePermissions = (updatedPermissions: FieldPermission[]) => {
    // 实际应用中这里应该调用API保存
    console.log('Saving field permissions:', updatedPermissions);
    setPermissions(updatedPermissions);
  };

  return (
    <Container>
      <h2>{t('title')}</h2>
      
      <Tabs defaultActiveKey="field-config" size="large">
        <TabPane tab={t('fieldConfigTab')} key="field-config">
          <FieldPermissionConfig 
            viewId={viewId}
            fields={fields}
            permissions={permissions}
            onSave={handleSavePermissions}
          />
        </TabPane>
        
        <TabPane tab={t('inheritanceTab')} key="inheritance">
          <PermissionInheritance orgId={orgId} />
        </TabPane>
      </Tabs>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  padding: 16px;
  overflow-y: auto;
`;