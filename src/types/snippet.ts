/**
 * 句子片段配置数据模型
 */
export interface SnippetConfig {
  /** 唯一标识符 */
  id: string;
  /** 句子标题（用于快速识别） */
  title: string;
  /** 句子内容（实际复制的文本） */
  content: string;
  /** 分类标签（可选，用于过滤） */
  category?: string;
  /** 描述信息（可选） */
  description?: string;
  /** 创建时间戳 */
  createdAt: number;
  /** 最后更新时间戳 */
  updatedAt: number;
  /** 使用次数（用于统计） */
  usageCount: number;
}

/**
 * 句子表单数据（用于新建/编辑）
 */
export interface SnippetFormData {
  title: string;
  content: string;
  category?: string;
  description?: string;
}
