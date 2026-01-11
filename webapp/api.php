<?php
// 设置响应头，告诉浏览器这是数据
header('Content-Type: application/json; charset=utf-8');

// === 配置区域 ===
// 不需要显示的文件夹
$exclude_dirs = ['.', '..', '.git', 'css', 'js', 'assets', 'lib', 'fonts', 'images'];

// 结果数组
$experiments = [];

// 1. 扫描当前目录下的所有文件夹
$dirs = array_filter(glob('*'), 'is_dir');

foreach($dirs as $dir) {
    // 跳过排除的文件夹
    if(in_array($dir, $exclude_dirs)) continue;
    
    // 检查子文件夹里有没有 index.html，没有就不显示
    $htmlPath = $dir . '/index.html';
    if(!file_exists($htmlPath)) continue;

    // 2. 提取标题 (尝试读取 HTML 中的 <title>)
    $title = ucfirst($dir); // 默认用文件夹名
    
    // 读取文件前 2KB 内容查找标题
    $content = file_get_contents($htmlPath, false, null, 0, 2048);
    if ($content && preg_match('/<title>(.*?)<\/title>/is', $content, $matches)) {
        // 提取标题并去掉两端空白
        $raw_title = trim($matches[1]);
        // 如果标题包含 "- Ultimate DISLab" 等后缀，去掉它，只留课程名
        $title_parts = explode('-', $raw_title);
        $title = trim($title_parts[0]);
    }

    // 3. 智能分类 (根据文件夹关键词)
    $category = 'others';
    $icon = 'fas fa-flask'; // 默认烧瓶图标
    
    // 转小写以便匹配
    $lower_dir = strtolower($dir);

    if (preg_match('/mech|pendulum|force|motion|newton|block|collision|energy/i', $lower_dir)) {
        $category = 'mechanics';
        $icon = 'fas fa-cogs';
    } elseif (preg_match('/elec|circuit|volt|magnet|field/i', $lower_dir)) {
        $category = 'electricity';
        $icon = 'fas fa-bolt';
    } elseif (preg_match('/opt|light|lens|prism|mirror/i', $lower_dir)) {
        $category = 'optics';
        $icon = 'fas fa-lightbulb';
    } elseif (preg_match('/audio|sound|wave|music/i', $lower_dir)) {
        $category = 'acoustics'; // 声学
        $icon = 'fas fa-music';
    } elseif (preg_match('/star|orbit|planet|space/i', $lower_dir)) {
        $category = 'astrophysics'; // 天体
        $icon = 'fas fa-globe-americas';
    }

    // 4. 添加到列表
    $experiments[] = [
        'id' => $dir,
        'title' => $title, // 您的中文标题
        'path' => $dir . '/index.html',
        'category' => $category,
        'icon' => $icon,
        'folder' => $dir
    ];
}

// 5. 排序逻辑：力学(1) -> 电学(2) -> 光学(3) -> 其他
usort($experiments, function($a, $b) {
    $priority = [
        'mechanics' => 1,
        'electricity' => 2,
        'optics' => 3,
        'acoustics' => 4,
        'astrophysics' => 5,
        'others' => 99
    ];
    
    $pA = $priority[$a['category']] ?? 99;
    $pB = $priority[$b['category']] ?? 99;
    
    // 如果优先级一样，按标题文字排
    if ($pA == $pB) {
        return strcmp($a['folder'], $b['folder']);
    }
    return $pA <=> $pB;
});

// 输出 JSON
echo json_encode($experiments, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>