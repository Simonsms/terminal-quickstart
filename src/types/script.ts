/**
 * 脚本配置数据模型
 */
export interface ScriptConfig {
  /** 唯一标识符 */
  id: string;
  /** 脚本名称 */
  name: string;
  /** 图标（可选，用于显示在列表中） */
  icon?: string;
  /** 工作目录路径（例如：C:\projects\my-project） */
  workingDir: string;
  /** 启动命令（例如：npm run dev） */
  command: string;
  /** 描述信息（可选） */
  description?: string;
  /** 创建时间戳 */
  createdAt: number;
  /** 最后更新时间戳 */
  updatedAt: number;
}

/**
 * 应用配置
 */
export interface AppConfig {
  /** 主题设置 */
  theme: 'light' | 'dark';
  /** 脚本列表 */
  scripts: ScriptConfig[];
  /** 配置版本号 */
  version: string;
}

/**
 * 脚本表单数据（用于新建/编辑）
 */
export interface ScriptFormData {
  name: string;
  workingDir: string;
  command: string;
  description?: string;
  icon?: string;
}
