import { Component, OnInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { QuranApiService } from '../../core/services/quran-api.service';
import { SurahDetail } from '../../core/models/quran.model';
import { AudioService, AudioState } from '../../core/services/audio.service';

@Component({
  selector: 'app-surah-detail',
  template: `
    <div class="page-container">
      <ng-container *ngIf="data$ | async as data; else loadingTpl">
        <div class="settings-overlay" *ngIf="isSettingsOpen" (click)="toggleSettings()">
          <div class="settings-modal glass" (click)="$event.stopPropagation()">
            <div class="settings-header">
              <h3>Pengaturan Tampilan</h3>
              <button class="close-btn" (click)="toggleSettings()">×</button>
            </div>
            
            <div class="settings-sections">
              <div class="settings-section">
                <span class="section-label">Visibilitas</span>
                <div class="custom-dropdown" [class.open]="openDropdown === 'visibility'">
                  <div class="dropdown-trigger" (click)="toggleDropdown('visibility')">
                     <span>Sesuaikan Tampilan</span>
                     <i class="fa-solid fa-chevron-down"></i>
                  </div>
                  <div class="dropdown-menu">
                     <div class="dropdown-item checkbox-item disabled">
                        <span class="cb-label">Ayat Arab</span>
                        <div class="custom-checkbox checked"><i class="fa-solid fa-check"></i></div>
                     </div>
                     <div class="dropdown-item checkbox-item" (click)="toggleView('latin'); $event.stopPropagation()">
                        <span class="cb-label">Latin / Transliterasi</span>
                        <div class="custom-checkbox" [class.checked]="settings.showLatin">
                          <i class="fa-solid fa-check" *ngIf="settings.showLatin"></i>
                        </div>
                     </div>
                     <div class="dropdown-item checkbox-item" (click)="toggleView('translation'); $event.stopPropagation()">
                        <span class="cb-label">Terjemahan Indonesia</span>
                        <div class="custom-checkbox" [class.checked]="settings.showTranslation">
                          <i class="fa-solid fa-check" *ngIf="settings.showTranslation"></i>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <span class="section-label">Pilih Qari</span>
                <div class="custom-dropdown" [class.open]="openDropdown === 'reciter'">
                  <div class="dropdown-trigger" (click)="toggleDropdown('reciter')">
                     <span>{{ getReciterName(settings.audioReciter) }}</span>
                     <i class="fa-solid fa-chevron-down"></i>
                  </div>
                  <div class="dropdown-menu">
                    <div class="dropdown-item" 
                         *ngFor="let reciter of reciters" 
                         [class.active]="settings.audioReciter === reciter.id"
                         (click)="setReciter(reciter.id); toggleDropdown('reciter')">
                      <span class="reciter-name">{{ reciter.name }}</span>
                      <i class="fa-solid fa-check" *ngIf="settings.audioReciter === reciter.id"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <span class="section-label">Ukuran Font</span>
                
                <div class="font-control-card">
                  <label>Arab</label>
                  <div class="control-row">
                    <button class="font-btn" (click)="adjustFont('arabic', -1)"><i class="fa-solid fa-minus"></i></button>
                    <span class="font-val">{{ settings.arabicFontSize }}px</span>
                    <button class="font-btn" (click)="adjustFont('arabic', 1)"><i class="fa-solid fa-plus"></i></button>
                  </div>
                </div>

                <div class="font-control-card" *ngIf="settings.showTranslation || settings.showLatin">
                  <label>Latin / Terjemahan</label>
                  <div class="control-row">
                    <button class="font-btn" (click)="adjustFont('translation', -1)"><i class="fa-solid fa-minus"></i></button>
                    <span class="font-val">{{ settings.translationFontSize }}px</span>
                    <button class="font-btn" (click)="adjustFont('translation', 1)"><i class="fa-solid fa-plus"></i></button>
                  </div>
                </div>
              </div>
            </div>

            <button class="apply-btn" (click)="toggleSettings()">Terapkan</button>
          </div>
        </div>

        <div class="surah-header animate-fade-in" id="top">
          <div class="header-overlay"></div>
          <div class="container header-content">
            <div class="surah-title">
              <div class="number-badge-container">
                <svg width="60" height="60" viewBox="0 0 40 40" class="badge-bg">
                  <path d="M20 2L24.5 6.5L30 6.5L30 12L34.5 16.5L34.5 23.5L30 28L30 33.5L24.5 33.5L20 38L15.5 33.5L10 33.5L10 28L5.5 23.5L5.5 16.5L10 12L10 6.5L15.5 6.5L20 2Z" 
                        fill="none" stroke="var(--accent-gold)" stroke-width="1.5"/>
                </svg>
                <span class="number">{{ data.nomor }}</span>
              </div>
              <h1>{{ data.namaLatin }}</h1>
              <h2 class="arabic-font">{{ data.nama }}</h2>
              <p class="meaning">~ {{ data.arti }} ~</p>
              
              <div class="meta-info">
                <span class="meta-item">{{ data.tempatTurun }}</span>
                <span class="separator">/</span>
                <span class="meta-item">{{ data.jumlahAyat }} Ayat</span>
              </div>
              
              <button class="play-all-btn" (click)="playAyah(data.audioFull)" 
                      [class.playing]="isAyahPlaying(data.audioFull)">
                <i class="fa-solid" [ngClass]="isAyahPlaying(data.audioFull) ? 'fa-pause' : 'fa-play'"></i>
                <span>Putar Murottal</span>
              </button>
            </div>

            <div class="bismillah-container" *ngIf="data.nomor !== 1 && data.nomor !== 9">
              <div class="divider"></div>
              <div class="bismillah arabic-font">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
              <div class="divider"></div>
            </div>
          </div>
        </div>

        <div class="native-scrollbar-overlay animate-fade-in">
          <div class="ayah-tracker-track" (mousemove)="onScrollerHover($event, data.ayat)" (mouseleave)="tooltipAyah = null">
            <div class="scroll-tooltip" 
                 [class.visible]="isScrolling"
                 [style.top.px]="clampedTooltipTop">
               <div class="tooltip-content glass">
                  <span class="label">Ayat</span>
                  <span class="val">{{ activeAyah || 1 }}</span>
               </div>
               <div class="tooltip-arrow"></div>
            </div>

            <div 
              *ngFor="let ayah of data.ayat" 
              class="ayah-marker"
              (click)="scrollToAyah(ayah.nomorAyat)">
            </div>

            <div class="hover-tooltip glass" *ngIf="tooltipAyah" [style.top.px]="tooltipTop">
              Ayat {{ tooltipAyah }}
            </div>
          </div>
        </div>

        <div class="container main-content animate-fade-in">
          <div class="ayah-list">
            <div class="ayah-card" *ngFor="let ayah of data.ayat" [id]="'ayah-' + ayah.nomorAyat">
               <div class="ayah-sidebar">
                 <div class="ayah-number-badge">
                   {{ ayah.nomorAyat }}
                 </div>
                 <button class="ayah-play-btn" 
                         (click)="playAyah(ayah.audio)"
                         [class.playing]="isAyahPlaying(ayah.audio)">
                   <i class="fa-solid" [ngClass]="isAyahPlaying(ayah.audio) ? 'fa-pause' : 'fa-play'"></i>
                 </button>
               </div>
              <div class="ayah-body">
                <div class="arabic-text arabic-font" dir="rtl" 
                     [style.fontSize.px]="settings.arabicFontSize">
                  {{ ayah.teksArab }}
                  <span class="end-of-ayah">﴿{{ ayah.nomorAyat }}﴾</span>
                </div>
                
                <div class="translation-section" *ngIf="settings.showTranslation || settings.showLatin">
                  <p class="latin-text" *ngIf="settings.showLatin" [style.fontSize.px]="settings.translationFontSize * 0.9">{{ ayah.teksLatin }}</p>
                  <p class="indo-text" *ngIf="settings.showTranslation" [style.fontSize.px]="settings.translationFontSize">{{ ayah.teksIndonesia }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="audio-player-bar animate-fade-in" *ngIf="isPlaying || currentAudioUrl">
            <div class="player-content glass">
              <div class="player-info">
                  <span class="player-label">Sedang Memutar</span>
                  <div class="player-wave">
                    <span></span><span></span><span></span>
                  </div>
              </div>
              <div class="player-controls">
                <button class="control-btn" (click)="audioService.pause()" *ngIf="isPlaying">
                  <i class="fa-solid fa-pause"></i>
                </button>
                 <button class="control-btn" (click)="audioService.play()" *ngIf="!isPlaying">
                  <i class="fa-solid fa-play"></i>
                </button>
                <button class="close-player-btn" (click)="audioService.stop()">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
        </div>

        <div class="bottom-menu animate-fade-in">
          <div class="nav-bar glass">
              <div class="action-group">
                  <a routerLink="/" class="nav-action-btn" title="Kembali ke Daftar">
                    <i class="fa-regular fa-house"></i>
                  </a>
                  <button class="nav-action-btn btn-thin" (click)="toggleSettings()" title="Pengaturan Tampilan">
                    <i class="fa-solid fa-sliders"></i>
                  </button>
              </div>

              <div class="nav-divider"></div>

              <div class="surah-nav-group">
                  <a [routerLink]="['/surah', data.suratSebelumnya ? data.suratSebelumnya.nomor : null]" 
                     *ngIf="data.suratSebelumnya; else emptyNavPrev"
                     class="nav-item">
                    <span class="label">Sebelumnya</span>
                    <span class="surah-name">{{ data.suratSebelumnya.namaLatin }}</span>
                  </a>
                  <ng-template #emptyNavPrev><div class="nav-item disabled"></div></ng-template>

                  <div class="sticky-title" [style.visibility]="showTitleInMenu ? 'visible' : 'hidden'">
                      <span class="current-surah">{{ data.namaLatin }}</span>
                      <span class="current-ayah" *ngIf="activeAyah">Ayat {{ activeAyah }}</span>
                  </div>

                  <a [routerLink]="['/surah', data.suratSelanjutnya ? data.suratSelanjutnya.nomor : null]" 
                     *ngIf="data.suratSelanjutnya; else emptyNavNext"
                     class="nav-item text-right">
                    <span class="label">Selanjutnya</span>
                    <span class="surah-name">{{ data.suratSelanjutnya.namaLatin }}</span>
                  </a>
                  <ng-template #emptyNavNext><div class="nav-item disabled"></div></ng-template>
              </div>
          </div>
        </div>
      </ng-container>

      <ng-template #loadingTpl>
        <div class="skeleton-wrapper">
          <div class="surah-header skeleton">
            <div class="container header-content">
              <div class="surah-title">
                <div class="sk-badge shimmer"></div>
                <div class="sk-title shimmer"></div>
                <div class="sk-subtitle shimmer"></div>
                <div class="sk-meta shimmer"></div>
              </div>
            </div>
          </div>
          <div class="container main-content">
            <div class="ayah-card skeleton shimmer" *ngFor="let i of [1,2,3,4]"></div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-container {
      background-color: var(--bg-warm);
      min-height: 100vh;
      position: relative;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .settings-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); z-index: 3000;
      display: flex; align-items: flex-end; justify-content: center;
      backdrop-filter: blur(4px);
    }
    .settings-modal {
      width: 100%; max-width: 380px;
      padding: 1.2rem 1.5rem; border-radius: 28px 28px 0 0;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
      
      /* Background Image Integration */
      background-image: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('/assets/images/settings_bg.png');
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
    }
    .settings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
    .settings-header h3 { margin: 0; color: var(--primary-deep); font-weight: 800; font-size: 1.1rem; }
    .close-btn { background: none; border: none; font-size: 1.5rem; color: #888; cursor: pointer; padding: 0.2rem; line-height: 1; }
    
    .settings-sections { display: flex; flex-direction: column; gap: 1.2rem; }
    .section-label { display: block; font-size: 0.7rem; font-weight: 800; color: var(--primary-deep); opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
    
    .toggle-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .custom-dropdown { position: relative; width: 100%; }
    .dropdown-trigger {
      width: 100%; padding: 0.8rem 1.2rem; background: rgba(255,255,255,0.7);
      border: 1px solid var(--border-light); border-radius: 14px;
      display: flex; justify-content: space-between; align-items: center;
      cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--primary-deep);
      transition: all 0.2s;
    }
    .dropdown-trigger:hover { background: white; border-color: var(--primary-emerald); }
    .dropdown-trigger i { transition: transform 0.3s; color: var(--text-muted); font-size: 0.8rem; }
    .custom-dropdown.open .dropdown-trigger { border-color: var(--primary-emerald); background: white; }
    .custom-dropdown.open .dropdown-trigger i { transform: rotate(180deg); color: var(--primary-emerald); }

    .dropdown-menu {
      position: absolute; top: 100%; left: 0; right: 0; margin-top: 0.5rem;
      background: white; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 0.5rem; z-index: 100;
      opacity: 0; visibility: hidden; transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid var(--border-light);
      max-height: 200px; overflow-y: auto;
    }
    .custom-dropdown.open .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }

    .dropdown-item {
      padding: 0.8rem 1rem; border-radius: 8px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.85rem; color: var(--text-slate); transition: all 0.2s;
      margin-bottom: 2px;
    }
    .dropdown-item:hover { background: var(--bg-warm); color: var(--primary-deep); }
    .dropdown-item.active { background: rgba(46, 125, 50, 0.1); color: var(--primary-emerald); font-weight: 700; }
    .dropdown-item.disabled { opacity: 0.6; pointer-events: none; }

    .checkbox-item { background: transparent; }
    .custom-checkbox {
      width: 20px; height: 20px; border-radius: 6px; border: 2px solid var(--border-light);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; background: white;
    }
    .dropdown-item:hover .custom-checkbox { border-color: var(--accent-gold); }
    .custom-checkbox.checked { background: var(--primary-emerald); border-color: var(--primary-emerald); }
    .custom-checkbox i { color: white; font-size: 0.7rem; }
    
    .font-control-card {
      background: rgba(255,255,255,0.5); border-radius: 16px; padding: 0.8rem 1rem;
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;
      border: 1px solid var(--border-light);
    }
    .font-control-card label { font-weight: 700; color: var(--text-slate); font-size: 0.85rem; }
    .control-row { display: flex; align-items: center; gap: 1rem; }
    .font-btn {
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-light);
      background: white; color: var(--primary-emerald); display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; font-size: 0.8rem;
    }
    .font-btn:hover { border-color: var(--primary-emerald); background: var(--bg-warm); }
    .font-val { font-weight: 800; color: var(--primary-deep); min-width: 35px; text-align: center; font-size: 0.9rem; }

    .apply-btn {
      width: 100%; margin-top: 1.8rem; padding: 1rem; border-radius: 16px;
      background: var(--primary-emerald); color: white; border: none; font-weight: 700;
      font-size: 0.9rem; cursor: pointer; transition: filter 0.2s;
    }
    .apply-btn:hover { filter: brightness(1.1); }

    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

    .surah-header {
      background: linear-gradient(135deg, var(--primary-deep) 0%, #113a14 100%);
      padding: 2rem 0 6rem 0; color: white; text-align: center; position: relative; overflow: hidden;
    }
    .surah-header::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: url('https://www.transparenttextures.com/patterns/islamic-art.png'); opacity: 0.1;
    }
    .header-content { position: relative; z-index: 1; }
    .top-nav { text-align: left; margin-bottom: 2rem; }
    .back-btn { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; }
    .number-badge-container { position: relative; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .number-badge-container .number { position: absolute; font-size: 1.2rem; font-weight: 700; color: var(--accent-gold); }
    h1 { font-size: 2.2rem; margin: 0; color: white; }
    h2 { font-size: 3rem; color: var(--accent-gold); margin: 0.5rem 0; font-weight: 400; }
    .meaning { color: rgba(255, 255, 255, 0.6); font-style: italic; font-size: 1rem; }
    .meta-info { display: flex; justify-content: center; gap: 1rem; font-size: 0.85rem; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }
    .bismillah-container { margin-top: 2rem; display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
    .bismillah { font-size: 2rem; color: white; }
    .divider { flex: 1; height: 1px; max-width: 80px; background: rgba(197, 160, 89, 0.5); }
    
    .play-all-btn {
      margin-top: 1.5rem;
      background: rgba(197, 160, 89, 0.2);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      padding: 0.6rem 1.2rem;
      border-radius: 50px;
      font-size: 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      transition: all 0.3s ease;
    }
    .play-all-btn:hover { background: var(--accent-gold); color: var(--primary-deep); }
    .play-all-btn.playing { background: var(--accent-gold); color: var(--primary-deep); box-shadow: 0 0 15px rgba(197, 160, 89, 0.4); }

    .native-scrollbar-overlay { position: fixed; right: 0; top: 0; bottom: 0; width: 10px; z-index: 2000; pointer-events: none; }
    .ayah-tracker-track { position: relative; height: 100%; width: 100%; pointer-events: auto; display: flex; flex-direction: column; }
    .ayah-marker { flex: 1; width: 100%; cursor: pointer; }
    .scroll-tooltip {
      position: absolute; right: 15px; display: flex; align-items: center;
      transform: translateY(-50%); transition: top 0.05s linear, opacity 0.3s ease, transform 0.3s ease; 
      pointer-events: none; opacity: 0;
    }
    .scroll-tooltip.visible { opacity: 1; transform: translateY(-50%) scale(1); }
    .scroll-tooltip:not(.visible) { transform: translateY(-50%) scale(0.9); }
    .tooltip-content { padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid var(--accent-gold); display: flex; flex-direction: column; align-items: center; min-width: 70px; }
    .tooltip-content .val { font-size: 1.25rem; font-weight: 800; color: var(--primary-deep); }
    .tooltip-arrow { border: 6px solid transparent; border-left: 8px solid var(--accent-gold); margin-left: -1px; }

    .main-content { margin-top: -3rem; position: relative; z-index: 2; padding-bottom: 8rem; }
    .ayah-card {
      background: var(--surface); border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem;
      box-shadow: var(--card-shadow); display: flex; gap: 1.5rem; border: 1px solid var(--border-light);
      scroll-margin-top: 1rem;
    }
    .ayah-sidebar { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .ayah-number-badge {
      width: 36px; height: 36px; background: var(--bg-warm); color: var(--primary-emerald);
      border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;
    }
    .ayah-play-btn {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: white; border: 1px solid var(--border-light);
      color: var(--primary-emerald);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s;
      font-size: 0.8rem;
    }
    .ayah-play-btn:hover { background: var(--primary-emerald); color: white; border-color: var(--primary-emerald); }
    .ayah-play-btn.playing { background: var(--accent-gold); color: white; border-color: var(--accent-gold); animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(197, 160, 89, 0); } 100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0); } }
    .arabic-text { line-height: 2.1; text-align: right; margin-bottom: 1.5rem; color: var(--text-slate); }
    .end-of-ayah { font-family: 'Amiri', serif; color: var(--accent-gold); margin-left: 0.4rem; }
    .translation-section { border-top: 1px solid var(--border-light); padding-top: 1.2rem; }
    .latin-text { color: var(--primary-emerald); margin-bottom: 0.5rem; line-height: 1.4; font-style: italic; }
    .indo-text { color: var(--text-slate); line-height: 1.6; }

    .audio-player-bar {
      position: fixed; bottom: 60px; left: 0; right: 0; z-index: 1000;
      padding: 0 1rem; display: flex; justify-content: center; pointer-events: none;
    }
    .player-content {
      pointer-events: auto;
      background: rgba(27, 94, 32, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(12px);
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      display: flex; align-items: center; gap: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      color: white;
      min-width: 300px;
      justify-content: space-between;
      animation: slideUpPlayer 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes slideUpPlayer { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .player-info { display: flex; align-items: center; gap: 1rem; }
    .player-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.7); }
    
    .player-controls { display: flex; align-items: center; gap: 1rem; }
    .control-btn {
      background: white; color: var(--primary-deep);
      width: 40px; height: 40px; border-radius: 50%; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 1rem; transition: transform 0.2s;
    }
    .control-btn:hover { transform: scale(1.1); }
    
    .close-player-btn {
      background: none; border: none; color: rgba(255,255,255,0.6);
      cursor: pointer; font-size: 1.2rem; margin-left: 0.5rem;
    }
    .close-player-btn:hover { color: white; }

    .player-wave span {
      display: inline-block; width: 3px; height: 15px; background: var(--accent-gold);
      margin: 0 2px; border-radius: 4px; animation: wave 1s infinite ease-in-out;
    }
    .player-wave span:nth-child(2) { animation-delay: 0.2s; }
    .player-wave span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes wave { 0%, 100% { height: 10px; } 50% { height: 20px; } }

    .bottom-menu {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 900;
      background: var(--surface); border-top: 1px solid var(--border-light);
      box-shadow: 0 -4px 15px rgba(0,0,0,0.05);
    }
    .nav-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 0.8rem; max-width: 900px; margin: 0 auto; min-height: 38px;
    }
    .nav-action-btn {
      background: none; border: none; padding: 4px 8px; cursor: pointer; font-size: 1.2rem; 
      color: #888888; opacity: 1; transition: all 0.2s;
    }
    .btn-thin i {
      -webkit-text-stroke: 0.15px #ffffff; /* Reduced stroke for gray color contrast */
    }
    .nav-action-btn:hover { opacity: 1; color: var(--primary-deep); }
    .nav-divider { width: 1px; height: 20px; background: var(--border-light); margin: 0 4px; }
    
    .action-group { display: flex; align-items: center; gap: 2px; }
    .surah-nav-group { flex: 1; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    
    .nav-item {
      display: flex; flex-direction: column; align-items: flex-start;
      padding: 4px 6px; text-decoration: none; color: var(--text-muted);
    }
    .text-right { align-items: flex-end; text-align: right; }
    .nav-item.disabled { opacity: 0; pointer-events: none; }
    .nav-item .label { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; opacity: 0.6; }
    .nav-item .surah-name { font-size: 0.8rem; font-weight: 700; color: var(--primary-emerald); margin-top: -1px; }

    .skeleton-wrapper { min-height: 100vh; background: var(--bg-warm); }
    .surah-header.skeleton { background: #e0e0e0; min-height: 250px; }
    .shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    
    .sk-badge { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1rem; }
    .sk-title { width: 200px; height: 30px; border-radius: 8px; margin: 0 auto 0.5rem; }
    .sk-subtitle { width: 150px; height: 20px; border-radius: 8px; margin: 0 auto 1rem; }
    .sk-meta { width: 120px; height: 15px; border-radius: 4px; margin: 0 auto; }
    .ayah-card.skeleton { height: 150px; margin-top: 1.5rem; border: none; }

    .animate-fade-in { animation: fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 768px) {
      .native-scrollbar-overlay { width: 5px; }
      .scroll-tooltip { right: 8px; }
      .tooltip-content { padding: 0.2rem 0.5rem; min-width: 45px; }
      .tooltip-content .val { font-size: 0.9rem; }
      
      .ayah-card { padding: 1.2rem; }
      .arabic-text { line-height: 1.8; margin-bottom: 1rem; }
      
      .nav-bar { padding: 0 0.4rem; justify-content: space-between !important; gap: 0.2rem; }
      .action-group { gap: 1px; flex: none; }
      .nav-divider { margin: 0 4px; height: 16px; flex: none; }
      
      .sticky-title {
        flex: 1; display: flex; flex-direction: column; align-items: center; 
        pointer-events: none; text-align: center;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .sticky-title[style*="hidden"] { opacity: 0; transform: translateY(5px); }
      .sticky-title[style*="visible"] { opacity: 1; transform: translateY(0); }
      
      .sticky-title .current-surah { font-size: 0.75rem; font-weight: 800; color: var(--primary-deep); line-height: 1.1; }
      .sticky-title .current-ayah { font-size: 0.5rem; font-weight: 600; color: var(--accent-gold); text-transform: uppercase; margin-top: 0; }

      .surah-nav-group { flex: 1 !important; display: flex !important; justify-content: space-between !important; }
      .nav-item { padding: 2px 4px; flex: initial !important; width: auto !important; }
      .nav-item .surah-name { font-size: 0.7rem; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .nav-item .label { font-size: 0.45rem; }
    }
  `]
})
export class SurahDetailComponent implements OnInit {
  data$!: Observable<SurahDetail | null>;
  tooltipAyah: number | null = null;
  tooltipTop = 0;

  scrollPercentage = 0;
  clampedTooltipTop = 0;
  activeAyah: number | null = null;
  showTitleInMenu = false;
  isScrolling = false;
  private scrollTimeout: any;
  private ayahElements: { num: number, offset: number }[] = [];

  isSettingsOpen = false;
  settings = {
    arabicFontSize: 20,
    translationFontSize: 12,
    showLatin: true,
    showTranslation: true,
    audioReciter: '05'
  };

  reciters = [
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim' },
    { id: '03', name: 'Abdurrahman as-Sudais' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi' }
  ];

  audioState$!: Observable<AudioState>;
  currentAudioUrl: string | null = null;
  isPlaying = false;

  constructor(
    private route: ActivatedRoute,
    private quranService: QuranApiService,
    public audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) { }

  openDropdown: string | null = null;

  toggleDropdown(name: string) {
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  getReciterName(id: string): string {
    return this.reciters.find(r => r.id === id)?.name || 'Pilih Qari';
  }

  ngOnInit() {
    this.audioState$ = this.audioService.getState();
    this.audioState$.subscribe(state => {
      this.isPlaying = state.isPlaying;
      this.currentAudioUrl = state.currentUrl;
      this.cdr.detectChanges();
    });

    this.data$ = this.route.paramMap.pipe(
      switchMap(params => {
        const number = Number(params.get('number'));
        return this.quranService.getSurah(number);
      }),
      tap(() => {
        this.ayahElements = [];
        setTimeout(() => this.calculateAyahPositions(), 1000);
      })
    );
  }

  playAyah(audioData: { [key: string]: string }) {
    const url = audioData[this.settings.audioReciter];
    if (this.currentAudioUrl === url && this.isPlaying) {
      this.audioService.pause();
    } else {
      this.audioService.playUrl(url);
    }
  }

  isAyahPlaying(audioData: { [key: string]: string }): boolean {
    const url = audioData[this.settings.audioReciter];
    return this.isPlaying && this.currentAudioUrl === url;
  }

  setReciter(id: string) {
    this.settings.audioReciter = id;
    this.audioService.stop();
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  adjustFont(type: 'arabic' | 'translation', delta: number) {
    if (type === 'arabic') {
      this.settings.arabicFontSize = Math.min(Math.max(this.settings.arabicFontSize + (delta * 2), 20), 60);
    } else {
      this.settings.translationFontSize = Math.min(Math.max(this.settings.translationFontSize + delta, 12), 30);
    }
    setTimeout(() => this.calculateAyahPositions(), 500);
  }

  toggleView(type: 'latin' | 'translation') {
    if (type === 'latin') this.settings.showLatin = !this.settings.showLatin;
    if (type === 'translation') this.settings.showTranslation = !this.settings.showTranslation;
    setTimeout(() => this.calculateAyahPositions(), 300);
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.calculateAyahPositions();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;

    const percentage = scrollPos / (docHeight || 1);
    this.scrollPercentage = Math.min(Math.max(percentage * 100, 0), 100);

    const tooltipHeight = 60;
    const margin = 15;
    const bottomMenuHeight = 45;
    const availableHeight = windowHeight - bottomMenuHeight;

    const rawTop = percentage * availableHeight;
    this.clampedTooltipTop = Math.min(Math.max(rawTop, margin + tooltipHeight / 2), availableHeight - margin - tooltipHeight / 2);

    this.showTitleInMenu = scrollPos > 250;

    this.isScrolling = true;
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      this.cdr.detectChanges();
    }, 1500);

    this.updateActiveAyah(scrollPos + (windowHeight * 0.3));

    this.cdr.detectChanges();
  }

  private calculateAyahPositions() {
    const elements = document.querySelectorAll('.ayah-card');
    const scrollPos = window.scrollY;
    this.ayahElements = Array.from(elements).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        num: parseInt(el.id.replace('ayah-', ''), 10),
        offset: rect.top + scrollPos
      };
    });
  }

  private updateActiveAyah(currentPos: number) {
    if (this.ayahElements.length === 0) return;
    let current = this.ayahElements[0].num;
    for (const item of this.ayahElements) {
      if (currentPos >= item.offset) {
        current = item.num;
      } else {
        break;
      }
    }
    this.activeAyah = current;
  }

  onScrollerHover(event: MouseEvent, ayahs: any[]) {
    const track = event.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
    const percentage = relativeY / rect.height;

    const index = Math.min(Math.floor(percentage * ayahs.length), ayahs.length - 1);
    const selectedAyah = ayahs[Math.max(0, index)];

    this.tooltipAyah = selectedAyah.nomorAyat;
    this.tooltipTop = relativeY;
  }

  scrollToAyah(nomorAyat: number) {
    const element = document.getElementById(`ayah-${nomorAyat}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy() {
    this.audioService.stop();
  }
}
