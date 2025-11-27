// --- 1. 基础类型定义 ---

// 颜色字符串的通用类型，可以是 RGB 或 RGBA 格式
type ColorString = string;

// 字体字重可以是数字字符串或 '400', '500' 等
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | string;

// --- 2. 接口定义 ---

/**
 * 定义字体风格对象（如 displayLarge, titleMedium）的结构
 */
interface FontStyle {
    fontFamily: string;
    letterSpacing: number;
    fontWeight: FontWeight;
    // lineHeight 和 fontSize 是可选的，因为 'default' 中没有
    lineHeight?: number;
    fontSize?: number;
}

/**
 * 定义整个 Fonts 对象的结构，它包含了各种 FontStyle
 */
interface ThemeFonts {
    displayLarge: FontStyle;
    displayMedium: FontStyle;
    displaySmall: FontStyle;
    headlineLarge: FontStyle;
    headlineMedium: FontStyle;
    headlineSmall: FontStyle;
    titleLarge: FontStyle;
    titleMedium: FontStyle;
    titleSmall: FontStyle;
    labelLarge: FontStyle;
    labelMedium: FontStyle;
    labelSmall: FontStyle;
    bodyLarge: FontStyle;
    bodyMedium: FontStyle;
    bodySmall: FontStyle;
    default: Omit<FontStyle, 'lineHeight' | 'fontSize'>; // 默认字体没有行高和字号
}

/**
 * 定义 Colors.elevation 对象的结构
 */
interface ColorElevation {
    level0: ColorString;
    level1: ColorString;
    level2: ColorString;
    level3: ColorString;
    level4: ColorString;
    level5: ColorString;
}

/**
 * 定义 Colors 对象的结构
 */
interface ThemeColors {
    primary: ColorString;
    onPrimary: ColorString;
    primaryContainer: ColorString;
    onPrimaryContainer: ColorString;
    secondary: ColorString;
    onSecondary: ColorString;
    secondaryContainer: ColorString;
    onSecondaryContainer: ColorString;
    tertiary: ColorString;
    onTertiary: ColorString;
    tertiaryContainer: ColorString;
    onTertiaryContainer: ColorString;
    error: ColorString;
    onError: ColorString;
    errorContainer: ColorString;
    onErrorContainer: ColorString;
    background: ColorString;
    onBackground: ColorString;
    surface: ColorString;
    onSurface: ColorString;
    surfaceVariant: ColorString;
    onSurfaceVariant: ColorString;
    outline: ColorString;
    outlineVariant: ColorString;
    shadow: ColorString;
    scrim: ColorString;
    inverseSurface: ColorString;
    inverseOnSurface: ColorString;
    inversePrimary: ColorString;
    elevation: ColorElevation;
    surfaceDisabled: ColorString;
    onSurfaceDisabled: ColorString;
    backdrop: ColorString;

    // 额外颜色属性
    border: ColorString;
    card: ColorString;
    notification: ColorString;
    text: ColorString;
}

/**
 * 定义完整的主题对象结构
 */
interface Theme {
    dark: boolean;
    roundness: number;
    version: number;
    isV3: boolean;
    colors: ThemeColors;
    fonts: ThemeFonts;
    animation: {
        scale: number;
    };
}

// --- 3. 常量声明与赋值 (确保符合 Theme 接口) ---

export const scLightTheme: Theme = {
    "dark": false,
    "roundness": 4,
    "version": 3,
    "isV3": true,
    colors: {
        primary: 'rgb(52, 61, 255)',
        onPrimary: 'rgb(255, 255, 255)',
        primaryContainer: 'rgb(224, 224, 255)',
        onPrimaryContainer: 'rgb(0, 0, 110)',
        secondary: 'rgb(92, 93, 114)',
        onSecondary: 'rgb(255, 255, 255)',
        secondaryContainer: 'rgb(225, 224, 249)',
        onSecondaryContainer: 'rgb(25, 26, 44)',
        tertiary: 'rgb(120, 83, 107)',
        onTertiary: 'rgb(255, 255, 255)',
        tertiaryContainer: 'rgb(255, 216, 238)',
        onTertiaryContainer: 'rgb(46, 17, 38)',
        error: 'rgb(186, 26, 26)',
        onError: 'rgb(255, 255, 255)',
        errorContainer: 'rgb(255, 218, 214)',
        onErrorContainer: 'rgb(65, 0, 2)',
        background: 'rgb(255, 251, 255)',
        onBackground: 'rgb(27, 27, 31)',
        surface: 'rgb(255, 251, 255)',
        onSurface: 'rgb(27, 27, 31)',
        surfaceVariant: 'rgb(228, 225, 236)',
        onSurfaceVariant: 'rgb(70, 70, 79)',
        outline: 'rgb(119, 118, 128)',
        outlineVariant: 'rgb(199, 197, 208)',
        shadow: 'rgb(0, 0, 0)',
        scrim: 'rgb(0, 0, 0)',
        inverseSurface: 'rgb(48, 48, 52)',
        inverseOnSurface: 'rgb(243, 239, 244)',
        inversePrimary: 'rgb(190, 194, 255)',
        elevation: {
            level0: 'transparent',
            level1: 'rgb(245, 242, 255)',
            level2: 'rgb(239, 236, 255)',
            level3: 'rgb(233, 230, 255)',
            level4: 'rgb(231, 228, 255)',
            level5: 'rgb(227, 224, 255)',
        },
        surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
        onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
        backdrop: 'rgba(48, 48, 56, 0.4)',

        border: "rgba(121, 116, 126, 1)",
        card: "rgb(244, 242, 255)",
        notification: "rgba(179, 38, 30, 1)",
        text: "rgba(28, 27, 31, 1)"
    },
    "fonts": {
        "displayLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 64,
            "fontSize": 57
        },
        "displayMedium": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 52,
            "fontSize": 45
        },
        "displaySmall": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 44,
            "fontSize": 36
        },
        "headlineLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 40,
            "fontSize": 32
        },
        "headlineMedium": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 36,
            "fontSize": 28
        },
        "headlineSmall": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 32,
            "fontSize": 24
        },
        "titleLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 28,
            "fontSize": 22
        },
        "titleMedium": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.15,
            "fontWeight": "500",
            "lineHeight": 24,
            "fontSize": 16
        },
        "titleSmall": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.1,
            "fontWeight": "500",
            "lineHeight": 20,
            "fontSize": 14
        },
        "labelLarge": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.1,
            "fontWeight": "500",
            "lineHeight": 20,
            "fontSize": 14
        },
        "labelMedium": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.5,
            "fontWeight": "500",
            "lineHeight": 16,
            "fontSize": 12
        },
        "labelSmall": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.5,
            "fontWeight": "500",
            "lineHeight": 16,
            "fontSize": 11
        },
        "bodyLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0.15,
            "fontWeight": "400",
            "lineHeight": 24,
            "fontSize": 16
        },
        "bodyMedium": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0.25,
            "fontWeight": "400",
            "lineHeight": 20,
            "fontSize": 14
        },
        "bodySmall": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0.4,
            "fontWeight": "400",
            "lineHeight": 16,
            "fontSize": 12
        },
        "default": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400"
        }
    },
    "animation": {
        "scale": 1
    }
};

export const scDarkTheme: Theme = {
    "dark": true,
    "roundness": 4,
    "version": 3,
    "isV3": true,
    colors: {
        primary: 'rgb(190, 194, 255)',
        onPrimary: 'rgb(0, 1, 172)',
        primaryContainer: 'rgb(0, 0, 239)',
        onPrimaryContainer: 'rgb(224, 224, 255)',
        secondary: 'rgb(197, 196, 221)',
        onSecondary: 'rgb(46, 47, 66)',
        secondaryContainer: 'rgb(68, 69, 89)',
        onSecondaryContainer: 'rgb(225, 224, 249)',
        tertiary: 'rgb(232, 185, 213)',
        onTertiary: 'rgb(70, 38, 59)',
        tertiaryContainer: 'rgb(94, 60, 82)',
        onTertiaryContainer: 'rgb(255, 216, 238)',
        error: 'rgb(255, 180, 171)',
        onError: 'rgb(105, 0, 5)',
        errorContainer: 'rgb(147, 0, 10)',
        onErrorContainer: 'rgb(255, 180, 171)',
        background: 'rgb(27, 27, 31)',
        onBackground: 'rgb(229, 225, 230)',
        surface: 'rgb(27, 27, 31)',
        onSurface: 'rgb(229, 225, 230)',
        surfaceVariant: 'rgb(70, 70, 79)',
        onSurfaceVariant: 'rgb(199, 197, 208)',
        outline: 'rgb(145, 144, 154)',
        outlineVariant: 'rgb(70, 70, 79)',
        shadow: 'rgb(0, 0, 0)',
        scrim: 'rgb(0, 0, 0)',
        inverseSurface: 'rgb(229, 225, 230)',
        inverseOnSurface: 'rgb(48, 48, 52)',
        inversePrimary: 'rgb(52, 61, 255)',
        elevation: {
            level0: 'transparent',
            level1: 'rgb(35, 35, 42)',
            level2: 'rgb(40, 40, 49)',
            level3: 'rgb(45, 45, 56)',
            level4: 'rgb(47, 47, 58)',
            level5: 'rgb(50, 50, 62)',
        },
        surfaceDisabled: 'rgba(229, 225, 230, 0.12)',
        onSurfaceDisabled: 'rgba(229, 225, 230, 0.38)',
        backdrop: 'rgba(48, 48, 56, 0.4)',

        border: "rgba(147, 143, 153, 1)",
        card: "rgb(44, 40, 49)",
        notification: "rgba(242, 184, 181, 1)",
        text: "rgba(230, 225, 229, 1)"
    },
    "fonts": {
        "displayLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 64,
            "fontSize": 57
        },
        "displayMedium": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 52,
            "fontSize": 45
        },
        "displaySmall": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 44,
            "fontSize": 36
        },
        "headlineLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 40,
            "fontSize": 32
        },
        "headlineMedium": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 36,
            "fontSize": 28
        },
        "headlineSmall": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 32,
            "fontSize": 24
        },
        "titleLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400",
            "lineHeight": 28,
            "fontSize": 22
        },
        "titleMedium": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.15,
            "fontWeight": "500",
            "lineHeight": 24,
            "fontSize": 16
        },
        "titleSmall": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.1,
            "fontWeight": "500",
            "lineHeight": 20,
            "fontSize": 14
        },
        "labelLarge": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.1,
            "fontWeight": "500",
            "lineHeight": 20,
            "fontSize": 14
        },
        "labelMedium": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.5,
            "fontWeight": "500",
            "lineHeight": 16,
            "fontSize": 12
        },
        "labelSmall": {
            "fontFamily": "sans-serif-medium",
            "letterSpacing": 0.5,
            "fontWeight": "500",
            "lineHeight": 16,
            "fontSize": 11
        },
        "bodyLarge": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0.15,
            "fontWeight": "400",
            "lineHeight": 24,
            "fontSize": 16
        },
        "bodyMedium": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0.25,
            "fontWeight": "400",
            "lineHeight": 20,
            "fontSize": 14
        },
        "bodySmall": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0.4,
            "fontWeight": "400",
            "lineHeight": 16,
            "fontSize": 12
        },
        "default": {
            "fontFamily": "sans-serif",
            "letterSpacing": 0,
            "fontWeight": "400"
        }
    },
    "animation": {
        "scale": 1
    }
};

// --- 4. 合并主题（使用 Utility Types 模拟合并逻辑） ---

// 由于原始代码使用了解构赋值来合并对象，但在 TS 中直接解构可能会丢失详细类型信息
// 这里使用 Record<string, any> 来简化外部合并，因为没有 MD3LightTheme 或 LightTheme 的定义
// 但对于 CombinedDefaultTheme 和 CombinedDarkTheme，我们强制其结果类型仍是 Theme

export const CombinedDefaultTheme: Theme = {
    ...scLightTheme,
    colors: {
        ...scLightTheme.colors,
    },
} as Theme;

export const CombinedDarkTheme: Theme = {
    ...scDarkTheme,
    colors: {
        ...scDarkTheme.colors,
    },
} as Theme;