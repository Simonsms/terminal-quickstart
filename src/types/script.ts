/**
 * 命令配置
 */
export interface CommandConfig {
  /** 命令唯一标识 */
  id: string;
  /** 命令名称（例如：开发模式、生产构建） */
  name: string;
  /** 命令内容（例如：npm run dev） */
  command: string;
}

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
  /** 启动命令列表 */
  commands: CommandConfig[];
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
  theme: "light" | "dark";
  /** 脚本列表 */
  scripts: ScriptConfig[];
  /** 句子片段列表 */
  snippets: import("./snippet").SnippetConfig[];
  /** 配置版本号 */
  version: string;
}

/**
 * 命令表单数据
 */
export interface CommandFormData {
  id?: string;
  name: string;
  command: string;
}

/**
 * 脚本表单数据（用于新建/编辑）
 */
export interface ScriptFormData {
  name: string;
  workingDir: string;
  commands: CommandFormData[];
  description?: string;
  icon?: string;
}
