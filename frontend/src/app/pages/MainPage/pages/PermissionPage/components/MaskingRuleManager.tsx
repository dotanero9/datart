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

import { 
  Button, 
  Card, 
  Col, 
  Drawer, 
  Form, 
  Input, 
  InputNumber, 
  Modal, 
  Radio, 
  Row, 
  Select, 
  Space, 
  Table,
  Tag,
  Typography 
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { MaskingRule, BuiltInMaskingRuleType } from '../types';
import { maskingRuleApi } from '../services/maskingRuleApi';

const { Text } = Typography;
const { Option } = Select;

interface MaskingRuleManagerProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (ruleId: string | null, maskType: string | null, maskParams: any) => void;
  currentPermission?: any;
}

export const MaskingRuleManager: React.FC<MaskingRuleManagerProps> = ({
  visible,
  onCancel,
  onSave,
  currentPermission,
}) => {
  const t = useI18NPrefix('permission.masking');
  const [rules, setRules] = useState<MaskingRule[]>([]);
  const [builtInTypes, setBuiltInTypes] = useState<BuiltInMaskingRuleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<MaskingRule | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rulesData, builtInTypesData] = await Promise.all([
        maskingRuleApi.getMaskingRules('current_org'), // 使用当前组织ID
        maskingRuleApi.getBuiltInRuleTypes(),
      ]);
      setRules(rulesData);
      setBuiltInTypes(builtInTypesData);
    } catch (error) {
      console.error('Failed to load masking rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingRule) {
        await maskingRuleApi.updateMaskingRule(editingRule.id, values);
      } else {
        await maskingRuleApi.createMaskingRule(values);
      }
      setShowCreateModal(false);
      form.resetFields();
      setEditingRule(null);
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('Failed to save masking rule:', error);
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      await maskingRuleApi.deleteMaskingRule(ruleId);
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('Failed to delete masking rule:', error);
    }
  };

  const handleApplyRule = (rule: MaskingRule) => {
    onSave(rule.id, rule.maskType, rule.params);
  };

  const handleCustomApply = (maskType: string, params?: any) => {
    onSave(null, maskType, params); // 使用内置规则类型，无具体规则ID
  };

  const builtInColumns: ColumnsType<BuiltInMaskingRuleType> = [
    {
      title: t('typeName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => handleCustomApply(record.id)}
        >
          {t('apply')}
        </Button>
      ),
    },
  ];

  const customColumns: ColumnsType<MaskingRule> = [
    {
      title: t('ruleName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('maskType'),
      dataIndex: 'maskType',
      key: 'maskType',
      render: (type) => (
        <Tag color="blue">
          {type.replace('MASKING_', '').replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleApplyRule(record)}
          >
            {t('apply')}
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingRule(record);
              form.setFieldsValue(record);
              setShowCreateModal(true);
            }}
          />
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title={t('managerTitle')}
      width={800}
      visible={visible}
      onClose={onCancel}
      destroyOnClose
    >
      <Container>
        {/* 内置脱敏规则 */}
        <Card title={t('builtInRules')} size="small" style={{ marginBottom: 24 }}>
          <Table
            rowKey="id"
            columns={builtInColumns}
            dataSource={builtInTypes}
            pagination={false}
            size="small"
          />
        </Card>

        {/* 自定义脱敏规则 */}
        <Card 
          title={t('customRules')} 
          size="small" 
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRule(null);
                form.resetFields();
                setShowCreateModal(true);
              }}
            >
              {t('createRule')}
            </Button>
          }
        >
          <Table
            rowKey="id"
            columns={customColumns}
            dataSource={rules}
            loading={loading}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>

        {/* 创建/编辑规则模态框 */}
        <Modal
          title={editingRule ? t('editRule') : t('createRule')}
          visible={showCreateModal}
          onCancel={() => {
            setShowCreateModal(false);
            form.resetFields();
            setEditingRule(null);
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateOrUpdate}
          >
            <Form.Item
              label={t('ruleName')}
              name="name"
              rules={[{ required: true, message: t('nameRequired') }]}
            >
              <Input placeholder={t('enterRuleName')} />
            </Form.Item>

            <Form.Item
              label={t('maskType')}
              name="maskType"
              rules={[{ required: true, message: t('typeRequired') }]}
            >
              <Select placeholder={t('selectMaskType')}>
                {builtInTypes.map(type => (
                  <Option key={type.id} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('description')}
              name="description"
            >
              <Input.TextArea rows={3} placeholder={t('enterDescription')} />
            </Form.Item>

            {/* 根据选择的脱敏类型显示不同的参数输入 */}
            <Form.Item noStyle dependencies={['maskType']}>
              {({ getFieldValue }) => {
                const maskType = getFieldValue('maskType');
                if (!maskType) return null;

                // 显示相应参数输入
                if (maskType === 'MASKING_SHOW_FIRST_N' || maskType === 'MASKING_SHOW_LAST_N') {
                  return (
                    <Form.Item
                      label={t('showCount')}
                      name={['params', 'count']}
                      rules={[{ required: true, message: t('countRequired') }]}
                    >
                      <InputNumber 
                        min={1} 
                        max={20} 
                        placeholder={t('enterCount')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  );
                }

                if (maskType === 'MASKING_MASK_CENTER_N') {
                  return (
                    <>
                      <Form.Item
                        label={t('showHeadCount')}
                        name={['params', 'headCount']}
                        rules={[{ required: true, message: t('countRequired') }]}
                      >
                        <InputNumber 
                          min={1} 
                          max={20} 
                          placeholder={t('enterCount')}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label={t('showTailCount')}
                        name={['params', 'tailCount']}
                        rules={[{ required: true, message: t('countRequired') }]}
                      >
                        <InputNumber 
                          min={1} 
                          max={20} 
                          placeholder={t('enterCount')}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label={t('maskChar')}
                        name={['params', 'maskChar']}
                      >
                        <Input placeholder={t('enterMaskChar')} maxLength={1} defaultValue="*" />
                      </Form.Item>
                    </>
                  );
                }

                if (maskType === 'MASKING_CUSTOM_REGEX') {
                  return (
                    <>
                      <Form.Item
                        label={t('regexPattern')}
                        name={['params', 'pattern']}
                        rules={[{ required: true, message: t('patternRequired') }]}
                      >
                        <Input placeholder={t('enterRegexPattern')} />
                      </Form.Item>
                      <Form.Item
                        label={t('replacement')}
                        name={['params', 'replacement']}
                        rules={[{ required: true, message: t('replacementRequired') }]}
                      >
                        <Input placeholder={t('enterReplacement')} />
                      </Form.Item>
                    </>
                  );
                }

                return null;
              }}
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('save')}
                </Button>
                <Button onClick={() => {
                  setShowCreateModal(false);
                  form.resetFields();
                  setEditingRule(null);
                }}>
                  {t('cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  padding: 16px 0;
`;