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
import { MaskingRule } from '../types';

// 脱敏规则相关的API调用
export const maskingRuleApi = {
  // 获取脱敏规则列表
  getMaskingRules: async (orgId: string) => {
    const { data } = await request2<MaskingRule[]>({
      url: `/organization/${orgId}/masking/rules`,
      method: 'GET',
    });
    return data;
  },

  // 创建脱敏规则
  createMaskingRule: async (rule: Omit<MaskingRule, 'id'>) => {
    const { data } = await request2<MaskingRule>({
      url: `/organization/masking/rules`,
      method: 'POST',
      data: rule,
    });
    return data;
  },

  // 更新脱敏规则
  updateMaskingRule: async (ruleId: string, rule: Partial<MaskingRule>) => {
    const { data } = await request2<MaskingRule>({
      url: `/organization/masking/rules/${ruleId}`,
      method: 'PUT',
      data: rule,
    });
    return data;
  },

  // 删除脱敏规则
  deleteMaskingRule: async (ruleId: string) => {
    const { data } = await request2<boolean>({
      url: `/organization/masking/rules/${ruleId}`,
      method: 'DELETE',
    });
    return data;
  },

  // 获取内置脱敏规则类型
  getBuiltInRuleTypes: async () => {
    return [
      { 
        id: 'MASKING_HIDE_ALL', 
        name: '隐藏全部 (Hide All)', 
        description: '完全隐藏字段值' 
      },
      { 
        id: 'MASKING_SHOW_FIRST_N', 
        name: '显示前N位 (Show First N)', 
        description: '只显示前N位字符，其余用*代替' 
      },
      { 
        id: 'MASKING_SHOW_LAST_N', 
        name: '显示后N位 (Show Last N)', 
        description: '只显示后N位字符，其余用*代替' 
      },
      { 
        id: 'MASKING_MASK_CENTER_N', 
        name: '遮盖中间N位 (Mask Center N)', 
        description: '遮盖中间N位字符，显示首尾各一定数量字符' 
      },
      { 
        id: 'MASKING_KEEP_HEAD_TAIL', 
        name: '保留头尾 (Keep Head Tail)', 
        description: '保留开头和结尾字符，中间部分替换为固定字符' 
      },
      { 
        id: 'MASKING_CUSTOM_REGEX', 
        name: '自定义正则 (Custom Regex)', 
        description: '使用自定义正则表达式进行脱敏' 
      },
      { 
        id: 'MASKING_HASH', 
        name: '哈希脱敏 (Hash Masking)', 
        description: '使用哈希算法对敏感信息进行处理' 
      }
    ];
  }
};