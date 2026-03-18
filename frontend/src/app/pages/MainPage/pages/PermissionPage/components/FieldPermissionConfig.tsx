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

import { Card, Col, Radio, Row, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { EditOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { FieldPermission, ViewField } from '../types';
import { MaskingRuleManager } from './MaskingRuleManager';

interface FieldPermissionConfigProps {
  viewId: string;
  fields: ViewField[];
  permissions: FieldPermission[];
  onSave: (permissions: FieldPermission[]) => void;
}

export const FieldPermissionConfig: React.FC<FieldPermissionConfigProps> = ({
  viewId,
  fields,
  permissions,
  onSave,
}) => {
  const t = useI18NPrefix('permission.field');
  const [localPermissions, setLocalPermissions] = useState<FieldPermission[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      setLocalPermissions(permissions);
    } else {
      // 初始化默认权限
      const defaultPermissions = fields.map(field => ({
        fieldId: field.id,
        fieldName: field.name,
        visibility: 'VISIBLE', // 默认可见
        maskingRuleId: null,
        maskType: null,
        maskParams: null,
      }));
      setLocalPermissions(defaultPermissions);
    }
  }, [fields, permissions]);

  const handleVisibilityChange = (fieldId: string, visibility: 'VISIBLE' | 'HIDDEN' | 'MASKED') => {
    const updated = localPermissions.map(perm => 
      perm.fieldId === fieldId ? { ...perm, visibility } : perm
    );
    setLocalPermissions(updated);
  };

  const handleMaskingRuleChange = (fieldId: string, ruleId: string | null, maskType: string | null, maskParams: any) => {
    const updated = localPermissions.map(perm => 
      perm.fieldId === fieldId 
        ? { ...perm, maskingRuleId: ruleId, maskType, maskParams } 
        : perm
    );
    setLocalPermissions(updated);
  };

  const columns: ColumnsType<FieldPermission> = [
    {
      title: t('fieldName'),
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: t('visibility'),
      dataIndex: 'visibility',
      key: 'visibility',
      width: 200,
      render: (_, record) => (
        <Radio.Group
          value={record.visibility}
          onChange={(e) => handleVisibilityChange(record.fieldId, e.target.value)}
          size="small"
        >
          <Tooltip title={t('visible')}>
            <Radio.Button value="VISIBLE">{t('visible')}</Radio.Button>
          </Tooltip>
          <Tooltip title={t('hidden')}>
            <Radio.Button value="HIDDEN">{t('hidden')}</Radio.Button>
          </Tooltip>
          <Tooltip title={t('masked')}>
            <Radio.Button value="MASKED">{t('masked')}</Radio.Button>
          </Tooltip>
        </Radio.Group>
      ),
    },
    {
      title: t('maskingRule'),
      dataIndex: 'maskingRuleId',
      key: 'maskingRule',
      width: 200,
      render: (_, record) => {
        if (record.visibility !== 'MASKED') {
          return <span style={{ color: '#aaa' }}>{t('notApplicable')}</span>;
        }
        
        return (
          <Space>
            {record.maskType && (
              <Tag color="blue">
                {record.maskType.replace('MASKING_', '').replace('_', ' ')}
              </Tag>
            )}
            <EditOutlined 
              onClick={() => setEditingField(record.fieldId)}
              style={{ cursor: 'pointer' }}
            />
          </Space>
        );
      },
    },
  ];

  const filteredFields = localPermissions.filter(perm => 
    fields.some(f => f.id === perm.fieldId)
  );

  return (
    <Container>
      <Card title={t('title')} size="small">
        <Table
          rowKey="fieldId"
          columns={columns}
          dataSource={filteredFields}
          pagination={false}
          size="small"
        />
      </Card>

      {editingField && (
        <MaskingRuleManager
          visible={!!editingField}
          onCancel={() => setEditingField(null)}
          onSave={(ruleId, maskType, maskParams) => {
            handleMaskingRuleChange(editingField, ruleId, maskType, maskParams);
            setEditingField(null);
          }}
          currentPermission={localPermissions.find(p => p.fieldId === editingField)}
        />
      )}

      <ButtonRow>
        <Space>
          <button 
            className="ant-btn ant-btn-primary"
            onClick={() => onSave(localPermissions)}
          >
            {t('save')}
          </button>
          <button 
            className="ant-btn"
            onClick={() => {
              // 重置为初始状态
              setLocalPermissions(permissions);
            }}
          >
            {t('cancel')}
          </button>
        </Space>
      </ButtonRow>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
  text-align: right;
`;