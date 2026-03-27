document.addEventListener('DOMContentLoaded', () => {

    const windowsStages = [
        { name: "Windows 1.0 BYTE Demo", image: "win1_byte_demo.png" },
        { name: "Windows 1.0 Development Release 5", image: "win1_dr5.png" },
        { name: "Windows 1.0", image: "win1.png" },
        { name: "Windows 2.0", image: "win2.png" },
        { name: "Windows 3.0", image: "win3.png" },
        { name: "Windows 3.1", image: "win31.png" },
        { name: "Windows Chicago", image: "chicago.png" },
        { name: "Windows 95", image: "win95.png" },
        { name: "Windows 98", image: "win98.png" },
        { name: "Windows 2000", image: "win2k.png" },
        { name: "Windows ME", image: "winME.png" },
        { name: "Windows Whistler", image: "whistler.png" },
        { name: "Windows XP", image: "winXP.png" },
        { name: "Windows Longhorn", image: "longhorn.png" },
        { name: "Windows Vista", image: "vista.png" },
        { name: "Windows 7 (Beta)", image: "win7beta.png" },
        { name: "Windows 7", image: "win7.png" },
        { name: "Windows 8 (Beta)", image: "win8beta.png" },
        { name: "Windows 8", image: "win8.png" },
        { name: "Windows 9", image: "win9.png" },
        { name: "Windows 10", image: "win10.png" },
        { name: "Windows 11", image: "win11.png" },
    ];

    const serverStages = [
        { name: "Windows 2000 Server", image: "winserver_2000.png" },
        { name: "Windows Server 2003", image: "winserver_2003.png" },
        { name: "Windows Server 2008", image: "winserver_2008.png" },
        { name: "Windows Server 2008 R2", image: "winserver_2008_r2.png" },
        { name: "Windows Server 2012", image: "winserver_2012.png" },
        { name: "Windows Server 2012 R2", image: "winserver_2012_r2.png" },
        { name: "Windows Server 2016", image: "winserver_2016.png" },
        { name: "Windows Server 2019", image: "winserver_2019.png" },
        { name: "Windows Server 2022", image: "winserver_2022.png" },
        { name: "Windows Server 2025", image: "winserver_2025.png" },
    ];

    const msdosStages = [
        { name: "MS-DOS 1.0", image: "msdos_1.png" },
        { name: "MS-DOS 2.0", image: "msdos_2.png" },
        { name: "MS-DOS 3.0", image: "msdos_3.png" },
        { name: "MS-DOS 4.0", image: "msdos_4.png" },
        { name: "MS-DOS 5.0", image: "msdos_5.png" },
        { name: "MS-DOS 6.x", image: "msdos_6.png" },
        { name: "MS-DOS 8.0", image: "msdos_8.png" },
    ];

    const macOSStages = [
        { name: "System 1", image: "macos_sys1.png" },
        { name: "System 2", image: "macos_sys2.png" },
        { name: "System 3", image: "macos_sys3.png" },
        { name: "System 4", image: "macos_sys4.png" },
        { name: "System 5", image: "macos_sys5.png" },
        { name: "System 6", image: "macos_sys6.png" },
        { name: "System 7", image: "macos_sys7.png" },
        { name: "Copland", image: "macos_copland.png" },
        { name: "Mac OS 8", image: "macos_8.png" },
        { name: "Mac OS 9", image: "macos_9.png" },
        { name: "Mac OS X 10.0 Cheetah", image: "macosx_cheetah.png" },
        { name: "Mac OS X 10.1 Puma", image: "macosx_puma.png" },
        { name: "Mac OS X 10.2 Jaguar", image: "macosx_jaguar.png" },
        { name: "Mac OS X 10.3 Panther", image: "macosx_panther.png" },
        { name: "Mac OS X 10.4 Tiger", image: "macosx_tiger.png" },
        { name: "Mac OS X 10.5 Leopard", image: "macosx_leopard.png" },
        { name: "Mac OS X 10.6 Snow Leopard", image: "macosx_snow_leopard.png" },
        { name: "OS X 10.7 Lion", image: "macosx_lion.png" },
        { name: "OS X 10.8 Mountain Lion", image: "macosx_mountain_lion.png" },
        { name: "OS X 10.9 Mavericks", image: "macosx_mavericks.png" },
        { name: "OS X 10.10 Yosemite", image: "macosx_yosemite.png" },
        { name: "OS X 10.11 El Capitan", image: "macosx_el_capitan.png" },
        { name: "macOS 10.12 Sierra", image: "macos_sierra.png" },
        { name: "macOS 10.13 High Sierra", image: "macos_high_sierra.png" },
        { name: "macOS 10.14 Mojave", image: "macos_mojave.png" },
        { name: "macOS 10.15 Catalina", image: "macos_catalina.png" },
        { name: "macOS 11 Big Sur", image: "macos_big_sur.png" },
        { name: "macOS 12 Monterey", image: "macos_monterey.png" },
        { name: "macOS 13 Ventura", image: "macos_ventura.png" },
        { name: "macOS 14 Sonoma", image: "macos_sonoma.png" },
        { name: "macOS 15 Sequoia", image: "macos_sequoia.png" },
        { name: "macOS 16 Tahoe", image: "macos_tahoe.png" },
    ];

    const iosStages = [
        { name: "iPhone OS 1", image: "ios1.png" },
        { name: "iPhone OS 2", image: "ios2.png" },
        { name: "iPhone OS 3", image: "ios3.png" },
        { name: "iOS 4", image: "ios4.png" },
        { name: "iOS 5", image: "ios5.png" },
        { name: "iOS 6", image: "ios6.png" },
        { name: "iOS 7", image: "ios7.png" },
        { name: "iOS 8", image: "ios8.png" },
        { name: "iOS 9", image: "ios9.png" },
        { name: "iOS 10", image: "ios10.png" },
        { name: "iOS 11", image: "ios11.png" },
        { name: "iOS 12", image: "ios12.png" },
        { name: "iOS 13", image: "ios13.png" },
        { name: "iOS 14", image: "ios14.png" },
        { name: "iOS 15", image: "ios15.png" },
        { name: "iOS 16", image: "ios16.png" },
        { name: "iOS 17", image: "ios17.png" },
        { name: "iOS 18", image: "ios18.png" },
        { name: "iOS 26", image: "ios26.png" },
    ];

    // iPhone-specific device timeline (models) — each entry uses a unique phone image asset
    const iphoneStages = [
        { name: "iPhone (2007)", image: "iphone_2007.png" },
        { name: "iPhone 3G", image: "iphone_3g.png" },
        { name: "iPhone 3GS", image: "iphone_3gs.png" },
        { name: "iPhone 4", image: "iphone_4.png" },
        { name: "iPhone 4S", image: "iphone_4s.png" },
        { name: "iPhone 5", image: "iphone_5.png" },
        { name: "iPhone 5c", image: "iphone_5c.png" },
        { name: "iPhone 5s", image: "iphone_5s.png" },
        { name: "iPhone 6", image: "iphone_6.png" },
        { name: "iPhone 6 Plus", image: "iphone_6_plus.png" },
        { name: "iPhone 6s", image: "iphone_6s.png" },
        { name: "iPhone 6s Plus", image: "iphone_6s_plus.png" },
        { name: "iPhone 7", image: "iphone_7.png" },
        { name: "iPhone 7 Plus", image: "iphone_7_plus.png" },
        { name: "iPhone 8", image: "iphone_8.png" },
        { name: "iPhone 8 Plus", image: "iphone_8_plus.png" },
        { name: "iPhone X", image: "iphone_x.png" },
        { name: "iPhone XR", image: "iphone_xr.png" },
        { name: "iPhone XS", image: "iphone_xs.png" },
        { name: "iPhone XS Max", image: "iphone_xs_max.png" },
        { name: "iPhone 11", image: "iphone_11.png" },
        { name: "iPhone 11 Pro", image: "iphone_11_pro.png" },
        { name: "iPhone 11 Pro Max", image: "iphone_11_pro_max.png" },
        { name: "iPhone 12 mini", image: "iphone_12_mini.png" },
        { name: "iPhone 12", image: "iphone_12.png" },
        { name: "iPhone 12 Pro", image: "iphone_12_pro.png" },
        { name: "iPhone 12 Pro Max", image: "iphone_12_pro_max.png" },
        { name: "iPhone 13 mini", image: "iphone_13_mini.png" },
        { name: "iPhone 13", image: "iphone_13.png" },
        { name: "iPhone 13 Pro", image: "iphone_13_pro.png" },
        { name: "iPhone 13 Pro Max", image: "iphone_13_pro_max.png" },
        { name: "iPhone 14", image: "iphone_14.png" },
        { name: "iPhone 14 Plus", image: "iphone_14_plus.png" },
        { name: "iPhone 14 Pro", image: "iphone_14_pro.png" },
        { name: "iPhone 14 Pro Max", image: "iphone_14_pro_max.png" },
        { name: "iPhone 15", image: "iphone_15.png" },
        { name: "iPhone 15 Plus", image: "iphone_15_plus.png" },
        { name: "iPhone 15 Pro", image: "iphone_15_pro.png" },
        { name: "iPhone 15 Pro Max", image: "iphone_15_pro_max.png" },
        { name: "iPhone 16", image: "iphone_16.png" },
        { name: "iPhone 16 Plus", image: "iphone_16_plus.png" },
        { name: "iPhone 16 Pro", image: "iphone_16_pro.png" },
        { name: "iPhone 16 Pro Max", image: "iphone_16_pro_max.png" },
        { name: "iPhone 17", image: "iphone_17.png" },
        { name: "iPhone 17 Plus", image: "iphone_17_plus.png" },
        { name: "iPhone 17 Pro", image: "iphone_17_pro.png" },
        { name: "iPhone 17 Pro Max", image: "iphone_17_pro_max.png" },
    ];

    const androidStages = [
        // very early / prototype builds (added pre-1.0 betas)
        { name: "Android 0.1 (alpha)", image: "android_0_1.png" },
        { name: "Android 0.5 (beta)", image: "android_0_5.png" },
        { name: "Android 0.8 (beta)", image: "android_0_8.png" },
        { name: "Android 0.9", image: "android_0_9.png" },
        { name: "Android htc-29386.0.9.0.0 (beta)", image: "android_htc_29386_0_9_0_0.png" },
        { name: "Android m3-rc37a (beta)", image: "android_m3_rc37a.png" },
        { name: "Android m5-rc15 (beta)", image: "android_m5_rc15.png" },

        // original 1.0 lineage
        { name: "Android (Astro Boy) / 1.0 prototype", image: "android_1.png" },
        { name: "Android 1.1 Petit Four", image: "android_1_1_petit_four.png" },

        // 1.x & 2.x historical releases (inserted Donut & Eclair)
        { name: "Android 1.5 Cupcake", image: "android_1_5.png" },
        { name: "Android 1.6 Donut", image: "android_1_6.png" },
        { name: "Android 2.0 Eclair", image: "android_2_0.png" },
        { name: "Android 2.2 Froyo", image: "android_2_2.png" },
        { name: "Android 2.3 Gingerbread", image: "android_2_3.png" },

        // 3.x tablet-focused release
        { name: "Android 3.0 Honeycomb", image: "android_3_0.png" },

        // 4.x historical releases (added Jelly Bean & KitKat)
        { name: "Android 4.0 ICS", image: "android_4.png" },
        { name: "Android 4.1 Jelly Bean", image: "android_4_1.png" },
        { name: "Android 4.4 KitKat", image: "android_4_4.png" },

        // mid-era releases
        { name: "Android 5.0 Lollipop", image: "android_5.png" },
        { name: "Android 6.0 Marshmallow", image: "android_6_0.png" },
        { name: "Android 7.0 Nougat", image: "android_7.png" },

        // Oreo and Pie era
        { name: "Android 8.0 Oreo", image: "android_8_0.png" },
        { name: "Android 9 Pie", image: "android_9.png" },

        // Modern Android (10+)
        { name: "Android 10", image: "android_10.png" },
        { name: "Android 11", image: "android_11.png" },
        { name: "Android 12", image: "android_12.png" },
        { name: "Android 12L", image: "android_12l.png" },
        { name: "Android 13", image: "android_13.png" },
        { name: "Android 14", image: "android_14.png" },
        { name: "Android 15 Vanilla Ice Cream", image: "android_15.png" },
        { name: "Android 16 Baklava", image: "android_16.png" },
    ];

    const linuxStages = [
        { name: "Linux (Tux)", image: "linux_tux.png" },
        { name: "GNOME 1", image: "linux_gnome_old.png" },
        { name: "KDE 1", image: "linux_kde_old.png" },
        { name: "Red Hat Linux", image: "linux_redhat_old.png" },
        { name: "Debian", image: "linux_debian.png" },
        { name: "Ubuntu", image: "linux_ubuntu_old.png" },
        { name: "Arch Linux", image: "linux_arch.png" },
        { name: "Fedora", image: "linux_fedora.png" },
        { name: "GNOME Modern", image: "linux_gnome_modern.png" },
        { name: "SteamOS", image: "linux_steamos.png" },
    ];

    // Symbian timeline - Nokia 3310 style UI assets (unique images expected)
    const symbianStages = [
        { name: "Symbian 6.0", image: "symbian_6_0.png" },
        { name: "Symbian 6.1", image: "symbian_6_1.png" },
        { name: "Symbian 7.0", image: "symbian_7_0.png" },
        { name: "Symbian 8.1", image: "symbian_8_1.png" },
        { name: "Symbian 9.1", image: "symbian_9_1.png" },
        { name: "Symbian 9.2", image: "symbian_9_2.png" },
        { name: "Symbian 9.3", image: "symbian_9_3.png" },
        { name: "Symbian 9.4", image: "symbian_9_4.png" },
        { name: "Symbian ^2", image: "symbian_caret2.png" },
        { name: "Symbian ^3", image: "symbian_caret3.png" },
    ];

    // --- Red Star OS stages (unique images expected) ---
    const redstarStages = [
        { name: "Red Star OS - North Korea Prototype", image: "redstar_prototype.png" },
        { name: "Red Star OS 1.0", image: "redstar_1_0.png" },
        { name: "Red Star OS 1.1", image: "redstar_1_1.png" },
        { name: "Red Star OS 2.0", image: "redstar_2_0.png" },
        { name: "Red Star OS 3.0", image: "redstar_3_0.png" },
        { name: "Red Star OS 3.0 Server", image: "redstar_3_0_server.png" },
        { name: "Red Star OS 4.0", image: "redstar_4_0.png" },
        { name: "Red Star OS 5.0", image: "redstar_5_0.png" },
        { name: "Red Star OS 6.0 (Early Beta)", image: "redstar_6_0_beta.png" },
    ];

    const xboxStages = [
        { name: "Original Xbox", image: "xbox_original.png" },
        { name: "Xbox 360", image: "xbox_360.png" },
        { name: "Xbox One", image: "xbox_one.png" },
        { name: "Xbox Series X/S", image: "xbox_series.png" },
    ];

    const nintendoStages = [
        { name: "Color TV-Game", image: "nintendo_color_tv_game.png" },
        { name: "Game & Watch", image: "nintendo_gandw.png" },
        { name: "Nintendo Entertainment System", image: "nintendo_nes.png" },
        { name: "Super Nintendo", image: "nintendo_snes.png" },
        { name: "Game Boy", image: "nintendo_gb.png" },
        { name: "Game Boy Color", image: "nintendo_gbc.png" },
        { name: "Game Boy Advance", image: "nintendo_gba.png" },
        { name: "GameCube", image: "nintendo_gamecube.png" },
        { name: "Nintendo DS", image: "nintendo_ds.png" },
        { name: "Wii", image: "nintendo_wii.png" },
        { name: "Nintendo DSi", image: "nintendo_dsi.png" },
        { name: "Nintendo 3DS", image: "nintendo_3ds.png" },
        { name: "Wii U", image: "nintendo_wiiu.png" },
        { name: "Nintendo Switch", image: "nintendo_switch.png" },
        { name: "Nintendo Switch 2", image: "nintendo_switch2.png" },
    ];

    const playstationStages = [
        { name: "PlayStation", image: "ps1.png" },
        { name: "PlayStation 2", image: "ps2.png" },
        { name: "PlayStation Portable", image: "psp.png" },
        { name: "PlayStation 3 (Fat)", image: "ps3_fat.png" },
        { name: "PlayStation 3 (Slim)", image: "ps3_slim.png" },
        { name: "PlayStation Vita", image: "ps_vita.png" },
        { name: "PlayStation 4", image: "ps4.png" },
        { name: "PlayStation 4 Slim", image: "ps4_slim.png" },
        { name: "PlayStation 5", image: "ps5.png" },
        { name: "PlayStation 5 Pro", image: "ps5_pro.png" },
    ];

    // Palm OS timeline (classic Palm devices)
    const palmStages = [
        { name: "Palm OS 1.0", image: "palm_os_1_0.png" },
        { name: "Palm OS 2.0", image: "palm_os_2_0.png" },
        { name: "Palm OS 3.0", image: "palm_os_3_0.png" },
        { name: "Palm OS 4.0", image: "palm_os_4_0.png" },
        { name: "Palm OS 5.0", image: "palm_os_5_0.png" },
        { name: "Palm OS Garnet 5.4", image: "palm_garnet_5_4.png" },
    ];

    const lgWebOSStages = [
        { name: "Palm webOS 1.0", image: "webos_palm_1.png" },
        { name: "Palm webOS 2.0", image: "webos_palm_2.png" },
        { name: "Palm webOS 3.0", image: "webos_palm_3.png" },
        { name: "HP webOS 4.0", image: "webos_hp_4.png" },
        { name: "HP webOS 5.0", image: "webos_hp_5.png" },
        { name: "HP webOS 6.0", image: "webos_hp_6.png" },
        { name: "LG webOS 22", image: "webos_lg_22.png" },
    ];

    const windowsPhoneStages = [
        { name: "Pocket PC 2000", image: "wp_pocketpc_2000.png" },
        { name: "Pocket PC 2002", image: "wp_pocketpc_2002.png" },
        { name: "Windows Mobile 2003", image: "wp_mobile_2003.png" },
        { name: "Windows CE 4.2", image: "wp_ce_4_2.png" },
        { name: "Windows Mobile 5.0", image: "wp_mobile_5.png" },
        { name: "Windows Mobile 6.0", image: "wp_mobile_6.png" },
        { name: "Windows Mobile 6.1", image: "wp_mobile_6_1.png" },
        { name: "Windows Mobile 6.5", image: "wp_mobile_6_5.png" },
        { name: "Windows Phone 7", image: "wp_7.png" },
        { name: "Windows Phone 7.5", image: "wp_7_5.png" },
        { name: "Windows Phone 7.8", image: "wp_7_8.png" },
        { name: "Windows Phone 8", image: "wp_8.png" },
        { name: "Windows Phone 8.1", image: "wp_8_1.png" },
        { name: "Windows 10 Mobile", image: "wp_10.png" },
    ];

    const os2Stages = [
        { name: "OS/2 1.0", image: "os2_1_0.png" },
        { name: "OS/2 1.1", image: "os2_1_1.png" },
        { name: "OS/2 1.2", image: "os2_1_2.png" },
        { name: "OS/2 1.3", image: "os2_1_3.png" },
        { name: "OS/2 2.0", image: "os2_2_0.png" },
        { name: "OS/2 2.00.1", image: "os2_2_00_1.png" },
        { name: "OS/2 2.1", image: "os2_2_1.png" },
        { name: "OS/2 2.11", image: "os2_2_11.png" },
        { name: "OS/2 Warp 3", image: "os2_warp_3.png" },
        { name: "OS/2 Warp 4", image: "os2_warp_4.png" },
        { name: "OS/2 Warp 4.51", image: "os2_warp_4_51.png" },
        { name: "OS/2 Warp 4.52", image: "os2_warp_4_52.png" },
    ];

    const computersStages = [
        { name: "Abacus", image: "comp_abacus.png" },
        { name: "ENIAC", image: "comp_eniac.png" },
        { name: "Kenbak-1", image: "comp_kenbak1.png" },
        { name: "Apple I", image: "comp_apple1.png" },
        { name: "Commodore 64", image: "comp_c64.png" },
        { name: "Apple II", image: "comp_apple2.png" },
        { name: "Apple Lisa", image: "comp_apple_lisa.png" },
        { name: "White Box PC", image: "comp_whitebox_pc.png" },
        { name: "HP Laptop", image: "comp_hp_laptop.png" },
        { name: "MacBook", image: "comp_macbook.png" },
        { name: "MacBook Air", image: "comp_macbook_air.png" },
        { name: "Chromebook", image: "comp_chromebook.png" },
        { name: "Gaming Computer", image: "comp_gaming_pc.png" },
    ];

    const segaStages = [
        { name: "SG-1000", image: "sega_sg1000.png" },
        { name: "Master System", image: "sega_mastersystem.png" },
        { name: "Genesis", image: "sega_genesis.png" },
        { name: "Game Gear", image: "sega_gamegear.png" },
        { name: "Sega CD", image: "sega_cd.png" },
        { name: "Sega 32X", image: "sega_32x.png" },
        { name: "Saturn", image: "sega_saturn.png" },
        { name: "Dreamcast", image: "sega_dreamcast.png" },
    ];

    const scratchStages = [
        { name: "Scratch 0.0.1", image: "scratch_0_0_1.png" },
        { name: "Scratch 0.1", image: "scratch_0_1.png" },
        { name: "Scratch 0.2", image: "scratch_0_2.png" },
        { name: "Scratch 0.3", image: "scratch_0_3.png" },
        { name: "Scratch 0.4", image: "scratch_0_4.png" },
        { name: "Scratch 0.5", image: "scratch_0_5.png" },
        { name: "Scratch 0.6", image: "scratch_0_6.png" },
        { name: "Scratch 1.0 Beta", image: "scratch_1_0_beta.png" },
        { name: "Scratch 1.0", image: "scratch_1.png" },
        { name: "Scratch 1.0.1", image: "scratch_1_0_1.png" },
        { name: "Scratch 1.0.2", image: "scratch_1_0_2.png" },
        { name: "Scratch 1.1 Beta", image: "scratch_1_1_beta.png" },
        { name: "Scratch 1.1", image: "scratch_1_1.png" },
        { name: "Scratch 1.2 Beta", image: "scratch_1_2_beta.png" },
        { name: "Scratch 1.2", image: "scratch_1_2.png" },
        { name: "Scratch 1.2.1", image: "scratch_1_2_1.png" },
        { name: "Scratch 1.3 Beta", image: "scratch_1_3_beta.png" },
        { name: "Scratch 1.3", image: "scratch_1_3.png" },
        { name: "Scratch 1.3.1", image: "scratch_1_3_1.png" },
        { name: "Scratch 1.4 Beta", image: "scratch_1_4_beta.png" },
        { name: "Scratch 1.4 Release Candidate", image: "scratch_1_4_rc.png" },
        { name: "Scratch 1.4", image: "scratch_1.png" },
        { name: "Scratch 1.4.0.1", image: "scratch_1_4_0_1.png" },
        { name: "Scratch 1.4.0.7", image: "scratch_1_4_0_7.png" },
        { name: "Scratch 2.0 Beta", image: "scratch_2_0_beta.png" },
        { name: "Scratch 2.0", image: "scratch_2.png" },
        { name: "Scratch 3.0 Beta", image: "scratch_3_0_beta.png" },
        { name: "Scratch 3.0", image: "scratch_3.png" },
        { name: "Scratch 3.1", image: "scratch_3.1.png" },
        { name: "Scratch 4.0", image: "scratch_4.png" },
    ];

    const websimStages = [
        { name: "Websim Private Beta", image: "websim_private_beta.png" },
        { name: "Websim Public Beta", image: "websim_public_beta.png" },
        { name: "Websim 1.0", image: "websim_1_0.png" },
        { name: "Websim 1.1", image: "websim_1_1.png" },
        { name: "Websim 1.5", image: "websim_1_5.png" },
        { name: "Websim 1.5.5", image: "websim_1_5_5.png" },
        { name: "Websim 2.0", image: "websim_2_0.png" },
        { name: "Websim 2.1", image: "websim_2_1.png" },
        { name: "Websim 2.1.1", image: "websim_2_1_1.png" },
        { name: "Websim 3.0", image: "websim_3_0.png" },
    ];

    const chromeOSStages = [
        { name: "CR-48", image: "chromeos_cr48.png" },
        { name: "ChromeOS 1", image: "chromeos_1.png" },
        { name: "ChromeOS 20", image: "chromeos_flat.png" },
        { name: "ChromeOS 28", image: "chromeos_flat.png" },
        { name: "ChromeOS 53", image: "chromeos_flat.png" },
        { name: "ChromeOS 100", image: "chromeos_100.png" },
        { name: "ChromeOS Flex", image: "chromeos_flex.png" },
        { name: "ChromeOS 120+", image: "chromeos_120plus.png" },
    ];

    const progressBarStages = [
        { name: "PB-DOS Shell", image: "pb_dos.png" },
        { name: "Progressbar 1", image: "pb_1.png" },
        { name: "Progressbar 2", image: "pb_2.png" },
        { name: "Progressbar 3.14", image: "pb_314.png" },
        { name: "Progressbar NOT 3.60", image: "pb_not360.png" },
        { name: "Progressbar Chitown", image: "pb_chitown.png" },
        { name: "Progressbar 95", image: "pb_95.png" },
        { name: "Progressbar 95 plus", image: "pb_95plus.png" },
        { name: "Progressbar NOT 4.0", image: "pb_not40.png" },
        { name: "Progressbar 98", image: "pb_98.png" },
        { name: "Progressbar Meme", image: "pb_meme.png" },
        { name: "Progressbar 2000", image: "pb_2000.png" },
        { name: "Progressbar Nepbar", image: "pb_nepbar.png" },
        { name: "Progressbar Whisper", image: "pb_whisper.png" },
        { name: "Progressbar XB", image: "pb_xb.png" },
        { name: "Progressbar Largehorn", image: "pb_largehorn.png" },
        { name: "Progressbar Wista", image: "pb_wista.png" },
        { name: "Progressbar 7", image: "pb_7.png" },
        { name: "Progressbar 81", image: "pb_81.png" },
        { name: "Progressbar 10", image: "pb_10.png" },
        { name: "Progressbar 1X", image: "pb_1x.png" },
        { name: "Progressbar 11", image: "pb_11.png" },
        { name: "Progressbar 11.22", image: "pb_1122.png" },
        { name: "Progressbar 12", image: "pb_12.png" },
    ];

    const amigaOSStages = [
        { name: "AmigaOS 1.0", image: "amigaos_1_0.png" },
        { name: "AmigaOS 1.3", image: "amigaos_1_3.png" },
        { name: "AmigaOS 2.0", image: "amigaos_2_0.png" },
        { name: "AmigaOS 3.0", image: "amigaos_3_0.png" },
        { name: "AmigaOS 3.1", image: "amigaos_3_1.png" },
        { name: "AmigaOS 3.5", image: "amigaos_3_5.png" },
        { name: "AmigaOS 3.9", image: "amigaos_3_9.png" },
        { name: "AmigaOS 4.0", image: "amigaos_4_0.png" },
        { name: "AmigaOS 4.1", image: "amigaos_4_1.png" },
    ];

    const companionGifs = {
        windows: { src: 'windows95kwaii.gif', alt: 'A kawaii Windows 95 logo screenpal' },
        server: { src: 'windows95kwaii.gif', alt: 'A kawaii Windows 95 logo screenpal' },
        msdos: { src: 'windows95kwaii.gif', alt: 'A kawaii Windows 95 logo screenpal' },
        macos: { src: 'macos.gif', alt: 'A classic Mac OS logo with legs and arms walking' },
        ios: { src: 'icegif-1491.gif', alt: 'A bouncing Apple logo' },
        iphone: { src: 'icegif-1491.gif', alt: 'A bouncing Apple logo' },
        linux: { src: 'linux_companion.gif', alt: 'Tux the penguin typing furiously' },
        android: { src: 'android_companion.gif', alt: 'The Android robot dancing' },
        playstation: { src: 'playstation_companion.gif', alt: 'A glitchy, rotating PlayStation logo' },
        xbox: { src: 'xbox_companion.gif', alt: 'Master Chief from Halo doing a silly dance' },
        nintendo: { src: 'nintendo_companion.gif', alt: 'Mario and Luigi dancing together' },
        webos: { src: 'webos_companion.gif', alt: 'Bouncing webOS logo' },
        palm: { src: 'webos_companion.gif', alt: 'A small Palm OS companion' }, // reuse a simple gif as placeholder
        winphone: { src: 'wp_companion.gif', alt: 'Flipping Windows Phone live tiles' },
        os2: { src: 'os2_companion.gif', alt: 'Bouncing IBM logo' },
        computers: { src: 'computers_companion.gif', alt: 'Matrix digital rain' },
        sega: { src: 'sega_companion.gif', alt: 'Sonic the Hedgehog running' },
        scratch: { src: 'scratch_companion.gif', alt: 'Scratch cat walking' },
        websim: { src: 'websim_companion.gif', alt: 'Pulsating WebSim logo' },
        chromeos: { src: 'chromeos_companion.gif', alt: 'A spinning Google Chrome logo' },
        progressbar: { src: 'progressbar_companion.gif', alt: 'A blue segment filling a progress bar' },
        amiga: { src: 'amiga_companion.gif', alt: 'A bouncing Amiga Boing Ball' },
        redstar: { src: 'linux_companion.gif', alt: 'A small red-star companion' }, // placeholder companion for Red Star
    };

    const evolutionPaths = {
        windows: windowsStages,
        server: serverStages,
        msdos: msdosStages,
        macos: macOSStages,
        ios: iosStages,
        iphone: iphoneStages,
        android: androidStages,
        linux: linuxStages,
        xbox: xboxStages,
        nintendo: nintendoStages,
        playstation: playstationStages,
        webos: lgWebOSStages,
        palm: palmStages,
        winphone: windowsPhoneStages,
        os2: os2Stages,
        computers: computersStages,
        sega: segaStages,
        scratch: scratchStages,
        websim: websimStages,
        chromeos: chromeOSStages,
        progressbar: progressBarStages,
        amiga: amigaOSStages,
        redstar: redstarStages,
        symbian: symbianStages,
    };

    const actionButtonLabels = {
        windows: { feed: "Install Updates", clean: "Defragment Disk", play: "Run Solitaire" },
        server: { feed: "Deploy Role", clean: "Check Logs", play: "Run PowerShell" },
        msdos: { feed: "Load Driver", clean: "Run `scandisk`", play: "Run `edit.com`" },
        macos: { feed: "Software Update", clean: "Repair Permissions", play: "Open Finder" },
        ios: { feed: "Download Update", clean: "Offload App", play: "Swipe to Unlock" },
        iphone: { feed: "Download Update", clean: "Offload App", play: "Swipe to Unlock" },
        android: { feed: "System Update", clean: "Clear Cache", play: "Open App" },
        linux: { feed: "Run `apt upgrade`", clean: "Compile Kernel", play: "Launch Terminal" },
        xbox: { feed: "System Update", clean: "Clear Cache", play: "Install Game" },
        nintendo: { feed: "Insert Cartridge", clean: "Blow on Connector", play: "Start Game" },
        playstation: { feed: "Insert Disc", clean: "Update Firmware", play: "Earn Trophy" },
        webos: { feed: "Load Card", clean: "Close Card", play: "Gesture" },
        palm: { feed: "Install HotSync", clean: "Purge DB Cache", play: "Open Graffiti" },
        winphone: { feed: "Pin Tile", clean: "Sync to Zune", play: "Check Live Tile" },
        os2: { feed: "Install FixPak", clean: "Check CONFIG.SYS", play: "Run PM Shell" },
        computers: { feed: "Provide Power", clean: "Dust Components", play: "Run Benchmark" },
        sega: { feed: "Insert Coin", clean: "Blow on Cartridge", play: "Press Start" },
        scratch: { feed: "Add Block", clean: "Refactor Scripts", play: "Click Green Flag" },
        websim: { feed: "Deploy to Cloud", clean: "Sync Files", play: "Open Browser" },
        redstar: { feed: "Apply Patch", clean: "Verify Signature", play: "Open Control Center" },
        symbian: { feed: "Install Firmware", clean: "Clear Messages", play: "Open Snake" },
    };

    let currentPath = 'windows';
    let currentStageIndex = 0;
    let progress = 0;
    const progressPerClick = 10;
    const progressToEvolve = 100;

    // DOM Elements
    const osWindowEl = document.getElementById('os-window');
    const osNameEl = document.getElementById('os-name');
    const osLogoEl = document.getElementById('os-logo');
    const progressBarEl = document.getElementById('progress-bar');
    const feedButton = document.getElementById('feed-button');
    const cleanButton = document.getElementById('clean-button');
    const playButton = document.getElementById('play-button');
    const controlsEl = document.getElementById('controls');
    const finalMessageEl = document.getElementById('final-message');
    const finalMessageTextEl = document.getElementById('final-message-text');
    const restartButton = document.getElementById('restart-button');
    const windowTitleEl = document.getElementById('window-title');
    const petAreaEl = document.getElementById('pet-area');
    const addCompanionButton = document.getElementById('add-companion-button');
    const quickUpgradeButton = document.getElementById('quick-upgrade-button');
    const downgradeButton = document.getElementById('downgrade-button');
    const dummyButton = document.getElementById('dummy-button');
    const closeButton = document.querySelector('.window-button.close');
    const deathScreenEl = document.getElementById('death-screen');
    const deathScreenContentEl = document.getElementById('death-screen-content');

    // Path selector buttons
    const windowsButton = document.getElementById('windows-button');
    const serverButton = document.getElementById('server-button');
    const msdosButton = document.getElementById('msdos-button');
    const macosButton = document.getElementById('macos-button');
    const iosButton = document.getElementById('ios-button');
    const androidButton = document.getElementById('android-button');
    const linuxButton = document.getElementById('linux-button');
    const xboxButton = document.getElementById('xbox-button');
    const nintendoButton = document.getElementById('nintendo-button');
    const playstationButton = document.getElementById('playstation-button');
    const webosButton = document.getElementById('webos-button');
    const palmButton = document.getElementById('palm-button');
    const winphoneButton = document.getElementById('winphone-button');
    const os2Button = document.getElementById('os2-button');
    const computersButton = document.getElementById('computers-button');
    const segaButton = document.getElementById('sega-button');
    const scratchButton = document.getElementById('scratch-button');
    const websimButton = document.getElementById('websim-button');
    const iphoneButton = document.getElementById('iphone-button');
    const redstarButton = document.getElementById('redstar-button');
    const symbianButton = document.getElementById('symbian-button');
    const pathButtons = [windowsButton, serverButton, msdosButton, macosButton, iosButton, iphoneButton, androidButton, linuxButton, xboxButton, nintendoButton, playstationButton, webosButton, palmButton, winphoneButton, os2Button, computersButton, segaButton, scratchButton, websimButton, redstarButton, symbianButton];
    const chromeosButton = document.getElementById('chromeos-button');
    const progressbarButton = document.getElementById('progressbar-button');
    const amigaButton = document.getElementById('amiga-button');
    pathButtons.push(chromeosButton, progressbarButton, amigaButton);

    // Screenpal state
    let screenpal = null;
    let screenpalState = {
        x: 0,
        y: 0,
        vx: 2,
        vy: 2
    };

    // --- Web Audio API Setup ---
    let audioCtx;
    const soundBuffers = {};
    let audioInitialized = false;

    async function setupAudio() {
        if (audioInitialized) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // On some browsers, the context starts suspended and must be resumed by a user gesture.
        const resumeAudio = () => {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            document.body.removeEventListener('click', resumeAudio);
            document.body.removeEventListener('touchend', resumeAudio);
        };
        document.body.addEventListener('click', resumeAudio);
        document.body.addEventListener('touchend', resumeAudio);

        await Promise.all([
            loadSound('click.mp3', 'click'),
            loadSound('evolve.mp3', 'evolve'),
            loadSound('error.mp3', 'error'),
            loadSound('startup.mp3', 'startup'),
            loadSound('downgrade.mp3', 'downgrade')
        ]);
        audioInitialized = true;
    }

    async function loadSound(url, name) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            soundBuffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
        } catch(e) {
            console.error(`Failed to load sound: ${name}`, e);
        }
    }

    function playSound(name) {
        if (!audioCtx || audioCtx.state !== 'running' || !soundBuffers[name]) return;
        const source = audioCtx.createBufferSource();
        source.buffer = soundBuffers[name];
        source.connect(audioCtx.destination);
        source.start(0);
    }
    // --- End Web Audio API Setup ---

    function applyTheme() {
        // Clear existing themes first to prevent conflicts
        const themes = [
            'theme-classic', 'theme-xp', 'theme-aero', 'theme-metro', 
            'theme-win10', 'theme-fluent', 'theme-macos-classic', 
            'theme-macos-aqua', 'theme-macos-modern', 'theme-dos', 'theme-linux',
            'theme-ios-classic', 'theme-ios-modern'
        ];
        osWindowEl.classList.remove(...themes);
    
        const stageName = evolutionPaths[currentPath][currentStageIndex].name;
    
        if (currentPath === 'windows' || currentPath === 'server') {
            // Server follows the main Windows UI trend
            if (currentStageIndex <= 8 && (currentPath === 'windows' || stageName.includes('2000') || stageName.includes('2003'))) osWindowEl.classList.add('theme-classic');
            else if (stageName.includes('XP')) osWindowEl.classList.add('theme-xp');
            else if (stageName.includes('Longhorn') || stageName.includes('Vista') || stageName.includes('Windows 7') || stageName.includes('2008')) osWindowEl.classList.add('theme-aero');
            else if (stageName.includes('Windows 8') || stageName.includes('Windows 9') || stageName.includes('Windows 10') || stageName.includes('2012') || stageName.includes('2016') || stageName.includes('2019')) {
                osWindowEl.classList.add('theme-metro');
                if (stageName.includes("Windows 10") || stageName.includes('2016') || stageName.includes('2019')) osWindowEl.classList.add('theme-win10');
            }
            else if (stageName.includes('Windows 11') || stageName.includes('2022') || stageName.includes('2025')) osWindowEl.classList.add('theme-fluent');
            else osWindowEl.classList.add('theme-classic'); // Fallback for edge cases
        } else if (currentPath === 'macos') {
            if (currentStageIndex <= 9) osWindowEl.classList.add('theme-macos-classic'); // System 1 to OS 9
            else if (currentStageIndex <= 21) osWindowEl.classList.add('theme-macos-aqua'); // OS X Cheetah to El Capitan
            else osWindowEl.classList.add('theme-macos-modern'); // macOS Sierra onwards
        } else if (currentPath === 'ios') {
            if (currentStageIndex <= 5) { // iPhone OS 1 to iOS 6
                osWindowEl.classList.add('theme-ios-classic');
            } else if (currentStageIndex >= 6 && currentStageIndex <= 17) { // iOS 7 to iOS 18
                osWindowEl.classList.add('theme-ios-modern');
            } else if (currentStageIndex === 18) { // iOS 26
                osWindowEl.classList.add('theme-aero');
            }
        } else if (currentPath === 'msdos') {
            osWindowEl.classList.add('theme-dos');
        } else if (currentPath === 'linux' || currentPath === 'computers' || currentPath === 'websim') {
            osWindowEl.classList.add('theme-linux');
        } else if (currentPath === 'os2') {
            osWindowEl.classList.add('theme-classic');
        } else {
            osWindowEl.classList.add('theme-classic'); // Default for other paths
        }
    }

    function updateActionButtons() {
        const labels = actionButtonLabels[currentPath];
        feedButton.textContent = labels.feed;
        cleanButton.textContent = labels.clean;
        playButton.textContent = labels.play;
    }

    function updateUI() {
        applyTheme(); // Apply theme before updating content

        const currentEvolutionPath = evolutionPaths[currentPath];
        const currentStage = currentEvolutionPath[currentStageIndex];
        osNameEl.textContent = currentStage.name;
        osLogoEl.src = currentStage.image;
        osLogoEl.alt = `${currentStage.name} Logo`;
        progressBarEl.style.width = `${progress}%`;
        const pathName = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
        windowTitleEl.textContent = `My ${pathName} Pet`;

        // Companion button is disabled if a companion is active.
        addCompanionButton.disabled = !!screenpal;

        // BG Styling
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = "#008080"; // default teal

        if (currentPath === 'windows') {
            if (currentStage.name.includes("XP")) {
                document.body.style.backgroundImage = "url('xp_bg.png')";
            } else if (currentStage.name.includes("Vista")) {
                document.body.style.backgroundColor = "#1a1a1a";
            } else {
                document.body.style.backgroundColor = "#008080";
            }
        } else if (currentPath === 'server') {
            document.body.style.backgroundColor = '#0078D4';
        } else if (currentPath === 'msdos') {
            document.body.style.backgroundColor = '#0000AA';
        } else if (currentPath === 'macos') {
            document.body.style.backgroundColor = '#DDDDDD';
        } else if (currentPath === 'ios') {
            document.body.style.backgroundColor = '#F5F5F7';
        } else if (currentPath === 'android') {
             document.body.style.backgroundColor = '#3ddc84'; // Android Green
        } else if (currentPath === 'linux') {
             document.body.style.backgroundColor = '#2c2c2c'; // Dark grey
        } else if (currentPath === 'xbox') {
             document.body.style.backgroundColor = '#107c10'; // Xbox Green
        } else if (currentPath === 'nintendo') {
            document.body.style.backgroundColor = '#e60012'; // Nintendo Red
        } else if (currentPath === 'playstation') {
            document.body.style.backgroundColor = '#0070d1'; // PlayStation Blue
        } else if (currentPath === 'webos') {
            document.body.style.backgroundColor = '#333333';
        } else if (currentPath === 'winphone') {
            document.body.style.backgroundColor = '#68217A'; // Windows Phone Purple
        } else if (currentPath === 'os2') {
            document.body.style.backgroundColor = '#00649D'; // IBM Blue
        } else if (currentPath === 'computers') {
            document.body.style.backgroundColor = '#1a1a2e'; // Dark tech blue
        } else if (currentPath === 'sega') {
            document.body.style.backgroundColor = '#0083c0'; // Sega Blue
        } else if (currentPath === 'scratch') {
            document.body.style.backgroundColor = '#f9a825'; // Scratch Orange
        } else if (currentPath === 'websim') {
            document.body.style.backgroundColor = '#1e1e2f'; // Dark navy blue
        } else if (currentPath === 'chromeos') {
            document.body.style.backgroundColor = '#f1f1f1';
        } else if (currentPath === 'progressbar') {
            document.body.style.backgroundColor = '#008080';
        } else if (currentPath === 'amiga') {
            document.body.style.backgroundColor = '#5a87c8';
        }
    }

    function handleCareAction() {
        if (currentStageIndex >= evolutionPaths[currentPath].length - 1) return;
        if (!audioInitialized) setupAudio(); // Init audio on first interaction

        progress = Math.min(progressToEvolve, progress + progressPerClick + Math.floor(Math.random() * 5));
        playSound('click');
        
        osLogoEl.style.transform = 'scale(1.1)';
        setTimeout(() => { osLogoEl.style.transform = 'scale(1)'; }, 150);

        if (progress >= progressToEvolve) {
            setTimeout(evolve, 300);
        }
        updateUI();
    }

    function evolve() {
        const currentEvolutionPath = evolutionPaths[currentPath];
        if (currentStageIndex >= currentEvolutionPath.length - 1) return;

        currentStageIndex++;
        progress = 0;
        
        playSound('evolve');
        
        let flashes = 0;
        const flashInterval = setInterval(() => {
            petAreaEl.style.backgroundColor = flashes % 2 === 0 ? '#ffff00' : '#ffffff';
            if (++flashes > 5) {
                clearInterval(flashInterval);
                petAreaEl.style.backgroundColor = '#ffffff';
            }
        }, 100);

        // Windows 9 is a special "glitch" case only for the windows path
        if (currentPath === 'windows' && currentEvolutionPath[currentStageIndex].name === "Windows 9") {
            updateUI();
            setTimeout(() => playSound('error'), 500);
            setTimeout(evolve, 1500);
            return;
        }
        
        if (currentStageIndex === currentEvolutionPath.length - 1) {
            endGame();
        }
        
        updateUI();
    }

    function endGame() {
        const pathName = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
        finalMessageTextEl.textContent = `Your ${pathName} Pet has reached its final form!`;
        controlsEl.style.display = 'none';
        finalMessageEl.style.display = 'block';
        playSound('startup');
    }

    function restartGame() {
        currentStageIndex = 0;
        progress = 0;
        controlsEl.style.display = 'flex';
        finalMessageEl.style.display = 'none';
        playSound('click');
        
        if (screenpal) {
            document.body.removeChild(screenpal);
            screenpal = null;
        }
        addCompanionButton.disabled = false;

        updateUI();
        updateActionButtons();
    }

    function switchPath(newPath) {
        if (currentPath === newPath) return;
        
        currentPath = newPath;
        
        pathButtons.forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${newPath}-button`).classList.add('active');

        restartGame();
    }

    // --- Death Screen Logic ---
    const deathScreenMessages = {
        bsod: `A fatal exception 0E has occurred at 0137:BFF00D42. The
current application will be terminated.

*  Press any key to terminate the current application.
*  Press CTRL+ALT+DEL again to restart your computer. You will
   lose any unsaved information in all applications.

                  Press any key to continue`,
        kernel_mac: `<h2>You need to restart your computer.</h2><p>Hold down the Power button for several seconds or press the Restart button.</p><p>Veuillez redémarrer votre ordinateur. Maintenez la touche de démarrage enfoncée pendant plusieurs secondes ou bien appuyez sur le bouton de réinitialisation.</p>`,
        plug_into_itunes: `
            <img src="usb_cable.png" alt="USB Cable" class="usb-cable">
            <img src="itunes_logo.png" alt="iTunes Logo" class="itunes-logo">
        `,
        kernel_linux: `[13833.682042] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
[13833.682042] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 5.4.0-42-generic #46-Ubuntu
[13833.682042] Hardware name: Innotek GmbH VirtualBox/VirtualBox
[13833.682042] Call Trace:
[13833.682042]  dump_stack+0x6d/0x8b
[13833.682042]  panic+0x101/0x2e3
[13833.682042]  mount_block_root+0x23f/0x2e8
[13833.682042]  mount_root+0x38/0x3a
[13833.682042]  prepare_namespace+0x13f/0x194
[13833.682042]  kernel_init_freeable+0x231/0x259
[13833.682042]  ? rest_init+0xb0/0xb0
[13833.682042]  kernel_init+0xe/0x100
[13833.682042]  ret_from_fork+0x1f/0x40
[13833.682042] ---[ end Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0) ]---`,
        android: `
            <img src="android_dead.png" alt="Dead Android">
            <p>No command.</p>
        `,
        playstation: `<h2>Red Screen of Death</h2><p>Please insert a PlayStation or PlayStation 2 format disc.</p>`,
        xbox: `<h2>System Error</h2><p>An error has occurred. Please contact Xbox Customer Support.</p><p>Error Code: E 74</p>`,
        nintendo: `<h2>An error has occurred.</h2><p>Hold down the POWER Button to turn off the power, then turn it on and try again.</p><p>For help, visit support.nintendo.com</p>`,
        webos: `<h2>No Signal</h2>`,
        os2: `<h2>SYS0205: The system is stopped.</h2><p>Correct the preceding error and restart the system.</p>`,
        hardware_failure: `<h2>Hardware Failure</h2><p>A critical component has failed. The system has been halted.</p><p style="font-size: 5em;">🔥</p>`,
        sega: `<h2>SOFTWARE ERROR</h2><p>PLEASE TURN OFF</p>`,
        scratch: `
            <img src="error_icon.png" alt="Error Icon">
            <h2>Project could not load.</h2>
            <p>Please try again.</p>
        `,
        websim: `<h2>404</h2><p>Not Found</p>`,
        amiga: `<h2>Guru Meditation</h2><p>Software Failure. Press left mouse button to continue.<br>Error: #80000003. Task: #0DEADBEEF.</p>`,
        progressbar: `<h2>Error</h2><p>A fatal exception has occurred. You have lost all your progress.</p>`,

        // New custom messages for Red Star, Symbian and Palm
        redstar_kernel: `<h2>Kernel Panic - Red Star OS</h2><pre>Kernel panic - not syncing: Attempted to kill init!\nCPU: 0 PID: 1 Comm: init Not tainted\nCall Trace:\n  panic+0x101/0x2e3\n  do_exit+0xabc/0xdef\n  ? start_kernel+0x0\n</pre><p>System halted.</p>`,
        symbian_crash: `<h2>Application Crashed</h2><p>The application has stopped unexpectedly on Symbian.</p><p>Options: [Close] [Send Error Report]</p>`,
        palm_error: `<h2>Error Occurred</h2><p>An unexpected error occurred in Palm OS. Please HotSync or restart the device.</p>`,
        // iPhone-specific kernel panic with Apple logo and hanging text
        iphone_kernel: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
                <img src="itunes_logo.png" alt="Apple Logo" style="width:120px;height:auto;filter:grayscale(1);opacity:0.95;">
                <h2 style="margin:0;">Kernel Panic</h2>
                <pre style="white-space:pre-wrap;text-align:left;max-width:520px;">
panic(cpu 0 caller 0xffffff80002b6f2f): "Kernel panic - not syncing: Unhandled trap"
Backtrace (CPU 0), Frame : Return Address
0xffffff80` + "`" + `00000000 : 0xffffff80000a1f0b
...
</pre>
                <p style="font-weight:bold;">We are hanging here. Please restart your device.</p>
            </div>
        `,
    };

    function showDeathScreen() {
        if (!audioInitialized) setupAudio();
        playSound('error');
        
        deathScreenEl.className = ''; // Clear previous classes
        let content = '';
        let screenClass = '';

        switch(currentPath) {
            case 'windows':
            case 'server':
            case 'msdos':
            case 'winphone':
                screenClass = 'bsod';
                content = deathScreenMessages.bsod;
                break;
            case 'progressbar':
                 screenClass = 'bsod';
                 content = deathScreenMessages.progressbar;
                 break;
            case 'os2':
                screenClass = 'bsod';
                content = deathScreenMessages.os2;
                break;
            case 'macos':
                screenClass = 'kernel-panic-mac';
                content = deathScreenMessages.kernel_mac;
                break;
            case 'ios':
                screenClass = 'plug-into-itunes';
                content = deathScreenMessages.plug_into_itunes;
                break;
            case 'iphone':
                // Show iPhone-specific kernel panic (Apple-style)
                screenClass = 'kernel-panic-mac';
                content = deathScreenMessages.iphone_kernel;
                break;
            case 'linux':
                screenClass = 'kernel-panic-linux';
                content = deathScreenMessages.kernel_linux;
                break;
            case 'android':
                screenClass = 'no-command-android';
                content = deathScreenMessages.android;
                break;
            case 'playstation':
                screenClass = 'rsod-ps';
                content = deathScreenMessages.playstation;
                break;
            case 'xbox':
                screenClass = 'death-xbox';
                content = deathScreenMessages.xbox;
                break;
            case 'nintendo':
                screenClass = 'error-nintendo';
                content = deathScreenMessages.nintendo;
                break;
            case 'webos':
                // WebOS already uses a "No Signal" style
                screenClass = 'no-signal-webos';
                content = deathScreenMessages.webos;
                break;

            // New mappings: Red Star -> kernel panic, Symbian -> app crash, Palm -> generic error
            case 'redstar':
                screenClass = 'kernel-panic-linux'; // reuse kernel-panic style (dark terminal)
                content = deathScreenMessages.redstar_kernel;
                break;
            case 'symbian':
                screenClass = 'death-websim'; // simple centered dialog style fits Symbian app crash
                content = deathScreenMessages.symbian_crash;
                break;
            case 'palm':
                screenClass = 'no-signal-webos'; // reuse a simple centered style for the Palm error
                content = deathScreenMessages.palm_error;
                break;

            case 'computers':
                screenClass = 'hardware-failure';
                content = deathScreenMessages.hardware_failure;
                break;
            case 'sega':
                screenClass = 'death-sega';
                content = deathScreenMessages.sega;
                break;
            case 'scratch':
                screenClass = 'death-scratch';
                content = deathScreenMessages.scratch;
                break;
            case 'websim':
                screenClass = 'death-websim';
                content = deathScreenMessages.websim;
                break;
            case 'amiga':
                screenClass = 'death-amiga';
                content = deathScreenMessages.amiga;
                break;
        }

        deathScreenEl.classList.add(screenClass);
        deathScreenContentEl.innerHTML = content;
        deathScreenEl.style.display = 'flex';
    }

    function hideDeathScreen() {
        deathScreenEl.style.display = 'none';
        playSound('click');
    }

    function triggerEggFall() {
        if (!audioInitialized) setupAudio();
    
        const numEggs = 30;
        for (let i = 0; i < numEggs; i++) {
            const egg = document.createElement('img');
            egg.src = 'easter_egg.png';
            egg.classList.add('falling-egg');
            document.body.appendChild(egg);
    
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 2 + 3; // 3-5s
            const delay = Math.random() * 3; // 0-3s
    
            egg.style.left = `${startX}px`;
            egg.style.animationDuration = `${duration}s`;
            egg.style.animationDelay = `${delay}s`;
    
            egg.addEventListener('animationend', () => {
                playSound('click');
                egg.remove();
            }, { once: true });
        }
    }

    function createScreenpal() {
        if (screenpal) return;

        playSound('click');

        const companion = companionGifs[currentPath];
        if (!companion) return; // No companion for this path

        screenpal = document.createElement('img');
        screenpal.id = 'screenpal';
        screenpal.src = companion.src;
        screenpal.alt = companion.alt;
        document.body.appendChild(screenpal);

        addCompanionButton.disabled = true;

        // Wait for image to load to get its dimensions
        screenpal.onload = () => {
            // Initial state
            const palWidth = screenpal.offsetWidth;
            const palHeight = screenpal.offsetHeight;
            screenpalState.x = Math.random() * (window.innerWidth - palWidth);
            screenpalState.y = Math.random() * (window.innerHeight - palHeight);
            screenpalState.vx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1 + 1.5);
            screenpalState.vy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1 + 1.5);

            // The gif faces left by default, so flip it if it starts by moving right
            screenpal.style.transform = `scaleX(${-Math.sign(screenpalState.vx)})`;

            requestAnimationFrame(animateScreenpal);
        };
    }

    function animateScreenpal() {
        if (!screenpal) return;

        screenpalState.x += screenpalState.vx;
        screenpalState.y += screenpalState.vy;

        const palWidth = screenpal.offsetWidth;
        const palHeight = screenpal.offsetHeight;

        if (screenpalState.x + palWidth >= window.innerWidth || screenpalState.x <= 0) {
            screenpalState.vx *= -1;
            // Flip the image based on direction
            screenpal.style.transform = `scaleX(${-Math.sign(screenpalState.vx)})`;
        }
        if (screenpalState.y + palHeight >= window.innerHeight || screenpalState.y <= 0) {
            screenpalState.vy *= -1;
        }

        screenpalState.x = Math.max(0, Math.min(screenpalState.x, window.innerWidth - palWidth));
        screenpalState.y = Math.max(0, Math.min(screenpalState.y, window.innerHeight - palHeight));
        
        screenpal.style.left = `${screenpalState.x}px`;
        screenpal.style.top = `${screenpalState.y}px`;

        requestAnimationFrame(animateScreenpal);
    }

    // Event Listeners
    feedButton.addEventListener('click', handleCareAction);
    cleanButton.addEventListener('click', handleCareAction);
    playButton.addEventListener('click', handleCareAction);
    restartButton.addEventListener('click', restartGame);
    addCompanionButton.addEventListener('click', createScreenpal);
    quickUpgradeButton.addEventListener('click', () => {
        if (!audioInitialized) setupAudio();
        // Immediately fill progress and trigger evolve if possible
        const currentEvolutionPath = evolutionPaths[currentPath];
        if (currentStageIndex < currentEvolutionPath.length - 1) {
            progress = progressToEvolve;
            playSound('evolve');
            // small delay so UI updates before evolving
            setTimeout(evolve, 120);
            updateUI();
        } else {
            // at final stage, play an error sound to indicate no upgrade available
            playSound('error');
        }
    });
    downgradeButton.addEventListener('click', () => {
        if (!audioInitialized) setupAudio();
        downgradeVersion();
    });
    closeButton.addEventListener('click', showDeathScreen);
    deathScreenEl.addEventListener('click', hideDeathScreen);

    dummyButton.addEventListener('click', (event) => {
        if (event.shiftKey) {
            triggerEggFall();
        } else {
            if (!audioInitialized) setupAudio();
            playSound('click');
        }
    });

    // Downgrade functionality: step back one stage (if possible)
    function downgradeVersion() {
        if (currentStageIndex <= 0) {
            // already at earliest stage
            playSound('error');
            return;
        }
        currentStageIndex = Math.max(0, currentStageIndex - 1);
        progress = 0;
        playSound('downgrade');

        // small flash to indicate change
        petAreaEl.style.backgroundColor = '#ffdddd';
        setTimeout(() => { petAreaEl.style.backgroundColor = '#ffffff'; }, 250);
        updateUI();
    }

    windowsButton.addEventListener('click', () => switchPath('windows'));
    serverButton.addEventListener('click', () => switchPath('server'));
    msdosButton.addEventListener('click', () => switchPath('msdos'));
    macosButton.addEventListener('click', () => switchPath('macos'));
    iosButton.addEventListener('click', () => switchPath('ios'));
    iphoneButton.addEventListener('click', () => switchPath('iphone'));
    androidButton.addEventListener('click', () => switchPath('android'));
    linuxButton.addEventListener('click', () => switchPath('linux'));
    xboxButton.addEventListener('click', () => switchPath('xbox'));
    nintendoButton.addEventListener('click', () => switchPath('nintendo'));
    playstationButton.addEventListener('click', () => switchPath('playstation'));
    webosButton.addEventListener('click', () => switchPath('webos'));
    winphoneButton.addEventListener('click', () => switchPath('winphone'));
    os2Button.addEventListener('click', () => switchPath('os2'));
    computersButton.addEventListener('click', () => switchPath('computers'));
    segaButton.addEventListener('click', () => switchPath('sega'));
    scratchButton.addEventListener('click', () => switchPath('scratch'));
    websimButton.addEventListener('click', () => switchPath('websim'));
    chromeosButton.addEventListener('click', () => switchPath('chromeos'));
    progressbarButton.addEventListener('click', () => switchPath('progressbar'));
    amigaButton.addEventListener('click', () => switchPath('amiga'));
    // enable clicking the Red Star OS, Symbian and Palm OS path buttons
    redstarButton.addEventListener('click', () => switchPath('redstar'));
    symbianButton.addEventListener('click', () => switchPath('symbian'));
    palmButton.addEventListener('click', () => switchPath('palm'));

    // Initial Setup
    updateUI();
    updateActionButtons();
});