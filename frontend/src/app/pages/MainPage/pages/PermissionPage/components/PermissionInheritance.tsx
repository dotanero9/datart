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

import { Card, Checkbox, Divider, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { PermissionInheritance, InheritanceLevel } from '../types';
import { fieldPermissionApi } from '../services/fieldPermissionApi';

interface PermissionInheritanceProps {
  orgId: string;
}

export const PermissionInheritance: React.FC<PermissionInheritanceProps> = ({ orgId }) => {
  const t = useI18NPrefix('permission.inheritance');
  const [inheritance, setInheritance] = useState<PermissionInheritance | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInheritanceSettings();
  }, [orgId]);

  const loadInheritanceSettings = async () => {
    if (!orgId) return;
    
    setLoading(true);
    try {
      const data = await fieldPermissionApi.getPermissionInheritance(orgId);
      setInheritance(data);
    } catch (error) {
      console.error('Failed to load inheritance settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInheritanceToggle = async (level: InheritanceLevel, enabled: boolean) => {
    if (!inheritance) return;
    
    const updatedInheritance = {
      ...inheritance,
      levels: inheritance.levels.map(l => 
        l.level === level ? { ...l, enabled } : l
      )
    };
    
    try {
      await fieldPermissionApi.updatePermissionInheritance(orgId, updatedInheritance);
      setInheritance(updatedInheritance);
    } catch (error) {
      console.error('Failed to update inheritance setting:', error);
      // 重新加载以恢复原始状态
      loadInheritanceSettings();
    }
  };

  const handleCascadeChange = async (level: InheritanceLevel, cascadeType: string, enabled: boolean) => {
    if (!inheritance) return;
    
    const updatedInheritance = {
      ...inheritance,
      levels: inheritance.levels.map(l => 
        l.level === level 
          ? { 
              ...l, 
              cascades: l.cascades.map(c => 
                c.type === cascadeType ? { ...c, enabled } : c
              )
            } 
          : l
      )
    };
    
    try {
      await fieldPermissionApi.updatePermissionInheritance(orgId, updatedInheritance);
      setInheritance(updatedInheritance);
    } catch (error) {
      console.error('Failed to update cascade setting:', error);
      // 重新加载以恢复原始状态
      loadInheritanceSettings();
    }
  };

  const inheritanceColumns: ColumnsType<any> = [
    {
      title: t('level'),
      dataIndex: 'level',
      key: 'level',
      render: (level: InheritanceLevel) => {
        const levelLabels: Record<InheritanceLevel, string> = {
          'ORGANIZATION': t('organization'),
          'DEPARTMENT': t('department'),
          'TEAM': t('team'),
          'USER': t('user'),
        };
        return <strong>{levelLabels[level]}</strong>;
      },
    },
    {
      title: t('enabled'),
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => handleInheritanceToggle(record.level, checked)}
          loading={loading}
        />
      ),
    },
    {
      title: t('cascadeOptions'),
      key: 'cascades',
      render: (_, record) => (
        <Space wrap>
          {record.cascades.map((cascade: any) => (
            <div key={cascade.type}>
              <Checkbox
                checked={cascade.enabled}
                onChange={(e) => handleCascadeChange(record.level, cascade.type, e.target.checked)}
              >
                {cascade.label}
              </Checkbox>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // 准备表格数据
  const tableData = inheritance?.levels.map(level => ({
    key: level.level,
    level: level.level,
    enabled: level.enabled,
    cascades: level.cascades,
    description: level.description,
  })) || [];

  return (
    <Container>
      <Card 
        title={t('title')} 
        size="small"
        extra={
          <Tooltip title={t('refresh')}>
            <ReloadOutlined 
              onClick={loadInheritanceSettings} 
              spin={loading}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        }
      >
        <Table
          columns={inheritanceColumns}
          dataSource={tableData}
          pagination={false}
          loading={loading}
          size="small"
        />
        
        <Divider />
        
        <DescriptionSection>
          <h4>{t('howItWorks')}</h4>
          <p>{t('inheritanceDescription')}</p>
          
          <ul>
            <li>{t('organizationToDepartment')}</li>
            <li>{t('departmentToTeam')}</li>
            <li>{t('teamToUser')}</li>
          </ul>
          
          <div style={{ marginTop: 16 }}>
            <Tag color="orange">{t('warning')}</Tag>
            <span>{t('inheritanceWarning')}</span>
          </div>
        </DescriptionSection>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
`;

const DescriptionSection = styled.div`
  h4 {
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 12px;
  }
  
  ul {
    margin-bottom: 12px;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
`;