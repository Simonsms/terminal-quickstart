use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct ScriptConfig {
    id: String,
    name: String,
    icon: Option<String>,
    #[serde(rename = "workingDir")]
    working_dir: String,
    command: String,
    description: Option<String>,
    #[serde(rename = "createdAt")]
    created_at: i64,
    #[serde(rename = "updatedAt")]
    updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct AppConfig {
    theme: String,
    scripts: Vec<ScriptConfig>,
    version: String,
}

/// 获取配置文件路径
fn get_config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    // 确保目录存在
    fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;
    
    Ok(app_data_dir.join("config.json"))
}

/// 获取配置文件路径（供前端查看调试）
#[tauri::command]
fn get_config_file_path(app: tauri::AppHandle) -> Result<String, String> {
    let config_path = get_config_path(&app)?;
    Ok(config_path.to_string_lossy().to_string())
}

/// 打开配置文件所在目录
#[tauri::command]
fn open_config_folder(app: tauri::AppHandle) -> Result<(), String> {
    let config_path = get_config_path(&app)?;
    let folder = config_path.parent().ok_or("无法获取目录")?;
    
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(folder)
            .spawn()
            .map_err(|e| format!("打开目录失败: {}", e))?;
    }
    
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(folder)
            .spawn()
            .map_err(|e| format!("打开目录失败: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(folder)
            .spawn()
            .map_err(|e| format!("打开目录失败: {}", e))?;
    }
    
    Ok(())
}

/// 加载配置
#[tauri::command]
fn load_config(app: tauri::AppHandle) -> Result<AppConfig, String> {
    let config_path = get_config_path(&app)?;
    
    if !config_path.exists() {
        // 返回默认配置
        return Ok(AppConfig {
            theme: "dark".to_string(),
            scripts: vec![],
            version: "1.0.0".to_string(),
        });
    }
    
    let content = fs::read_to_string(&config_path).map_err(|e| e.to_string())?;
    let config: AppConfig = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    Ok(config)
}

/// 保存配置
#[tauri::command]
fn save_config(app: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    let config_path = get_config_path(&app)?;
    
    let json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(&config_path, json).map_err(|e| e.to_string())?;
    
    Ok(())
}

/// 选择目录
#[tauri::command]
async fn select_directory(app: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_dialog::DialogExt;
    use std::sync::mpsc;
    
    let (tx, rx) = mpsc::channel();
    
    app.dialog()
        .file()
        .pick_folder(move |folder_path| {
            let _ = tx.send(folder_path);
        });
    
    match rx.recv().map_err(|e| e.to_string())? {
        Some(path) => Ok(path.to_string()),
        None => Err("未选择目录".to_string())
    }
}

/// 执行脚本
#[tauri::command]
async fn execute_script(working_dir: String, command: String) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "cmd", "/K", &command])
            .current_dir(&working_dir)
            .spawn()
            .map_err(|e| format!("执行失败: {}", e))?;
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Command::new("sh")
            .args(["-c", &command])
            .current_dir(&working_dir)
            .spawn()
            .map_err(|e| format!("执行失败: {}", e))?;
    }
    
    Ok("脚本已启动".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            load_config,
            save_config,
            select_directory,
            execute_script,
            get_config_file_path,
            open_config_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
