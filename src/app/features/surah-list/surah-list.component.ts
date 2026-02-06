import { Component, OnInit, ElementRef, ViewChildren, QueryList, HostListener } from '@angular/core';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { QuranApiService } from '../../core/services/quran-api.service';
import { Surah } from '../../core/models/quran.model';

@Component({
  selector: 'app-surah-list',
  template: `
    <div class="page-container">
      <div class="hero-section">
        <div class="hero-content animate-fade-in-up">
          <div class="app-logo-container">
            <img src="assets/images/favicon.svg" alt="Quran App Logo" class="app-logo">
          </div>
          <div class="hero-decoration">
            <svg viewBox="0 0 200 40" class="bismillah-svg">
               <path fill="currentColor" d="M123.6,18.8c0.6-2.1,1.5-3.6,5.3-3.6c4.6,0,5.7-0.1,5.6-0.5c-0.1-0.4-3.1-0.4-5.3-0.4c-1.6,0-4.9,0.1-4.9,0.7c0,0.4,1.8,4.7,0.7,5.5c-0.9,0.7-3.9-6.3-4.8-6.3c-1,0-1,2.5-0.7,3.5c0.3,1.3,4.2,3.3,4.2,5.2c0,1.5-2.6,0.3-3.5-0.1c-1.8-0.8-3.6-2.2-5.7-2.2 c-1.3,0-2.3,0.7-2.3,1.9c0,1.9,6.5,1.9,6.5,4.9c0,1.8-1.5,2.4-3.2,2.4c-4,0-6.1-3.6-6.1-3.6s-1.4,4.2-4.9,4.2c-1.3,0-3.3-0.9-4-3.2 c-0.6-2.1-1.3-8.8-1.7-10.7c-0.3-1.4-2.1-1.1-2.1-0.2c0,0.6,0.5,5.7,0.5,6.7c0,2.9-4.5,7.3-7.5,7.3c-1.6,0-2.6-1-2.6-2.4 c0-1.8,2.7-5.1,3.4-6.4c1.3-2.6,2.2-7.1,2.2-10.7c0-2.1-1.5-2.2-3.1-2.2c-2.3,0-5.4,1.9-6.9,4.8c-1.5,2.8-2.6,8.2-3.1,11.3 c-0.1,0.5-0.1,1.1-1.3,1.1c-1.4,0-1.3-1.6-1.3-2.1c0-0.6,0.2-2.3,0.2-2.3s-2.1,2.9-4.8,2.9c-2.6,0-4.5-2.4-4.5-4.8 c0-2.3,1.9-4.5,3.3-6.2c-0.8-1.5-1.9-3.2-3.8-3.2c-1.6,0-2.4,1.1-3.4,2.3c-1.4,1.7-4,5.4-4,7.6c0,2.2,1.3,4.5,3.7,4.5 c1.5,0,3.5-1.1,4.5-2.2c0.3-0.3,0.8-0.5,0.8-0.5s0.2,0.6,0.2,0.8c-0.2,1.6-2.3,2.8-4,2.8c-2.6,0-5.3-2.2-5.3-5.2 c0-2.8,2.5-10.7,2.5-12c0-0.7-0.7-1.1-1.6-1.1c-1.6,0-4,1.4-5.2,2.5c-0.9,0.9-2.5,4.7-3.1,6c-0.6-0.3-1.2-0.8-1.5-1.5 c-0.4-0.9-0.2-2,0.6-3.1c0.8-1.1,2.2-2.1,3.2-2.1c-0.2-0.6-0.6-1.5-1.2-1.9c-1.1-0.7-3-0.2-4.1,0.3c-1.8,0.9-5,5.1-7.1,5.1 c-0.8,0-1.4-0.3-1.8-0.9c-0.2,0.3-0.5,0.6-0.8,0.7c-0.6,0.3-1.4,0-1.9-0.5c-0.6-0.6-0.6-1.5-0.4-2.3c0.1-0.4,0.4-0.9,0.7-1.3 c0.5-0.6,1.2-1.2,1.2-1.9c0-0.8-0.7-1.3-1.4-1.3c-1.8,0-3.3,2-4.4,3.2c-0.9,1-3.6,4.6-3.6,4.6s-1.4-1.1-2.4-2.6 c-0.6-0.9-1.3-1.8-2.3-1.8c-0.8,0-1.5,0.6-2,1.2c-0.5-0.2-0.9-0.5-1.2-0.9c-0.6-0.8-0.3-1.8,0.5-2.5c1-0.9,2.8-1.5,2.8-2.9 c0-1.2-1.4-1.3-2.3-1.3c-1.9,0-5.8,5.1-5.7,5.5c0.1,0.3,2.2-0.9,2.9,0.2c0.6,1.1-2.6,5.1-3.8,5.1c-0.7,0-1-0.8-1-1.4 c0-0.3,0.1-0.7,0.1-0.7s-1.8,1.4-3,1.4c-2.2,0-2.4-2.4-2.4-2.4s-1.4,1.7-2.9,1.7c-1.5,0-2.5-1.6-2.5-3.1c0-0.8,0.2-1.6,0.6-2.3 c-0.5,0-1,0.2-1.4,0.5c-1.1,0.9-1.1,2.5-1.1,2.5s-2.1-1.7-3.9-1.7c-1.5,0-2.5,1.5-2.5,3c0,1,0.5,1.7,0.5,1.7s-1.3,0.3-1.8-0.1 c-0.9-0.6-0.5-2.6-0.5-2.6s-1.6,1-2.9,1c-0.7,0-1.2-0.3-1.6-0.9c-0.1,0.2-0.3,0.4-0.5,0.6c-0.5,0.5-1.3,0.7-1.9,0.5 c-0.4-0.1-0.7-0.4-0.9-0.7c-0.5,0.3-1,0.5-1.6,0.5c-1.1,0-1.8-0.9-2.1-1.8c-1.2,1.1-2.7,1.8-4.4,1.8c-2.3,0-3.9-1.5-3.9-3.6 c0-2.8,2.8-6.1,2.8-6.1s0.8-0.9,0.8-1.6c0-1.4-2-0.8-3-0.8c-1.7,0-4,1.7-4.4,4.2c1.3-0.7,2.2,0.3,1.9,1.8c-0.4,2.3-3.6,4-5.9,4 c-1.5,0-2.5-0.9-2.5-2.3c0-1.8,1.8-4.1,2.8-5.3c0.9-1.2,3.3-3.9,3.3-3.9s1-1.2,1-2c0-1.4-1.9-0.9-3.2-0.9c-3,0-5.8,3.2-7.5,6 c-0.6,1-1.6,2.9-2.4,2.9c-0.6,0-0.9-0.9-0.7-1.5c1-3.6,3.3-9.5,3.3-10.9c0-1.7-1.3-1.8-2.6-1.8c-2.3,0-4.6,2-5.7,4.3 c-1,2.1-1.9,5.7-2.3,8c-1.6-1.7-1.7-4.1-0.8-6.2c0.6-1.3,1.6-2.4,2.7-2.4c0.8,0,1.1,0.4,1.1,0.4s0.6-0.9,2.1-0.9c1,0,2.4,0.7,2.4,2.2 c0,0.8-0.4,2.3-1.3,3.4c1.1-1.4,1-3.3,0-4.7c-0.6-0.9-1.6-1.3-2-1.3c-0.3,0-0.6,0.1-0.8,0.2c-0.5-1.2-1.5-1.9-2.7-1.9 c-2.4,0-4,2.9-4.8,4.7c-1.1,2.6-1.4,6.2-1.4,6.2s-2.6,3.6-5.4,3.6c-1.5,0-2.4-0.8-2.4-2.2c0-2,2.3-5.2,4.8-5.2c0.9,0,1.6,0.5,1.6,0.5 s-0.1,2-1.7,2.6c1.1-0.1,1.9-1.4,1.9-2.3c0-0.6-0.5-1.2-1.6-1.2c-2.1,0-4.4,2.2-5.1,3.8c-1,1.9-1.2,4.3-0.3,6.3 c0.6,1.4,1.8,2.7,3.3,2.7c2.5,0,5.7-3.1,6.8-4.5c0.3,1.4,1.1,2.9,2.6,2.9c1,0,2-0.7,2.7-1.6c0.3,1,1.2,1.6,2.3,1.6 c1.7,0,3.3-1.6,4.5-2.8c-0.5,2.1,0.2,3.3,1.7,3.3c1.7,0,3.5-1.7,4.3-3.1c0.3,1.8,1.7,3.1,3.6,3.1c1.3,0,2.7-0.7,3.5-2 c0.3,0.9,1.1,1.9,2.2,1.9c1.6,0,3.1-1.6,3.8-2.6c0.3,0.5,0.8,1,1.7,1c2,0,3.7-2.2,4.4-3.4c0.5,1.2,1.3,2.2,2.4,2.2 c1.6,0,3-1.7,3.6-2.5c0.4,0.6,1.1,1,1.8,1c1.2,0,2-1.1,2.4-1.9c0.2,1.3,1.2,1.8,2.3,1.8c0.6,0,1.4-0.2,1.9-0.7 c0.1,0.6,0.6,1.6,1.5,1.6c1.2,0,2.1-1.3,2.7-2.3c0.4,1.3,1.6,2.2,3,2.2c1,0,2-0.7,2.7-1.6c0.3,1,1.2,1.6,2.3,1.6 c0.3,0,0.6-0.1,0.9-0.2c0.4,0.9,1.3,1.5,2.3,1.5c1.1,0,2.1-0.8,2.8-1.7c0.4,1,1.3,1.7,2.4,1.7c0.8,0,1.5-0.3,2-0.9 c0.4,1.3,1.2,2.1,2.2,2.1c1.4,0,2.3-1.3,2.8-2.1c0.4,1.3,1.5,2.1,2.9,2.1c1.8,0,3.3-1.7,4.1-3C161.7,18.7,162.2,19.2,163,19.2z"/>
            </svg>
          </div>
          <h1>Al-Quran Digital</h1>
          <div class="divider-ornament">
            <span>✻</span>
          </div>
          <p class="subtitle">
            "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
            <span class="source-cite">(HR. Bukhari no. 5027)</span>
          </p>
        </div>
      </div>

      <div class="content-section container">
        <app-loading *ngIf="loading$ | async"></app-loading>
        <app-error *ngIf="error$ | async"></app-error>

        <div class="surah-grid" *ngIf="filteredSurahs$ | async as surahs">
          <a 
            *ngFor="let surah of surahs" 
            #surahCard
            [attr.data-surah]="surah.nomor"
            [routerLink]="['/surah', surah.nomor]"
            class="surah-card">
            
            <div class="card-left">
              <div class="surah-number-badge">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <path d="M20 2L24.5 6.5L30 6.5L30 12L34.5 16.5L34.5 23.5L30 28L30 33.5L24.5 33.5L20 38L15.5 33.5L10 33.5L10 28L5.5 23.5L5.5 16.5L10 12L10 6.5L15.5 6.5L20 2Z" 
                        fill="none" stroke="var(--accent-gold)" stroke-width="1.5"/>
                </svg>
                <span class="number">{{ surah.nomor }}</span>
              </div>
              <div class="surah-info">
                <h3 class="surah-name">{{ surah.namaLatin }}</h3>
                <div class="surah-meta">
                  <span>{{ surah.jumlahAyat }} Ayat</span>
                  <span class="dot">•</span>
                  <span>{{ surah.tempatTurun }}</span>
                </div>
                <p class="surah-meaning">{{ surah.arti }}</p>
              </div>
            </div>
            
            <div class="card-right">
              <div class="surah-arabic-name arabic-font">{{ surah.nama }}</div>
            </div>
          </a>

          <div class="empty-state" *ngIf="surahs.length === 0 && !(loading$ | async)">
            <div class="empty-icon">📖</div>
            <p>Surah tidak ditemukan</p>
          </div>
        </div>
      </div>

      <div class="native-scrollbar-overlay animate-fade-in" *ngIf="(filteredSurahs$ | async)?.length">
        <div class="ayah-tracker-track" (mousemove)="onScrollerHover($event)" (mouseleave)="tooltipSurah = null">
          <div class="scroll-tooltip" 
               [class.visible]="isScrolling"
               [style.top.px]="clampedTooltipTop">
             <div class="tooltip-content glass">
                <span class="label">Surah</span>
                <span class="val">{{ activeSurahNumber || 1 }}</span>
             </div>
             <div class="tooltip-arrow"></div>
          </div>

           <div class="hover-tooltip glass" *ngIf="tooltipSurah" [style.top.px]="tooltipTop">
              <span class="surah-num">{{ tooltipSurah.nomor }}</span>
              <span class="surah-label">{{ tooltipSurah.namaLatin }}</span>
            </div>
        </div>
      </div>

      <footer class="app-footer animate-fade-in">
        <p>Dikembangkan oleh <a href="https://hasanaskari.com" target="_blank" class="website-link">hasanaskari.com</a></p>
      </footer>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      position: relative;
    }

    .native-scrollbar-overlay { position: fixed; right: 0; top: 0; bottom: 0; width: 10px; z-index: 2000; pointer-events: none; }
    .ayah-tracker-track { position: relative; height: 100%; width: 100%; pointer-events: auto; display: flex; flex-direction: column; }
    .scroll-tooltip {
      position: absolute; right: 15px; display: flex; align-items: center;
      transform: translateY(-50%); transition: top 0.05s linear, opacity 0.3s ease, transform 0.3s ease; 
      pointer-events: none; opacity: 0;
    }
    .scroll-tooltip.visible { opacity: 1; transform: translateY(-50%) scale(1); }
    .scroll-tooltip:not(.visible) { transform: translateY(-50%) scale(0.9); }
    .tooltip-content { padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid var(--accent-gold); display: flex; flex-direction: column; align-items: center; min-width: 70px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); }
    .tooltip-content .label { font-size: 0.65rem; text-transform: uppercase; color: var(--accent-gold); letter-spacing: 1px; font-weight: 600; }
    .tooltip-content .val { font-size: 1.25rem; font-weight: 800; color: var(--primary-deep); line-height: 1; }
    .tooltip-arrow { border: 6px solid transparent; border-left: 8px solid var(--accent-gold); margin-left: -1px; }

    .hover-tooltip {
      position: absolute; right: 20px;
      padding: 0.4rem 0.8rem; border-radius: 8px;
      display: flex; align-items: center; gap: 0.5rem;
      pointer-events: none; font-size: 0.8rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      white-space: nowrap;
      z-index: 2001;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      color: var(--primary-deep);
      border: 1px solid var(--accent-gold);
    }
    
    .hover-tooltip .surah-num {
      background: var(--accent-gold); color: var(--primary-deep);
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.7rem;
    }

    .hover-tooltip .surah-label {
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    }

    .app-footer {
      text-align: center;
      padding: 3rem 1rem 4rem;
      background: linear-gradient(to top, var(--primary-deep) 0%, #154522 100%);
      color: rgba(253, 252, 240, 0.7);
      font-size: 0.85rem;
      letter-spacing: 1px;
      font-family: 'Inter', sans-serif;
      position: relative;
      z-index: 10;
      margin-top: 4rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .app-footer p {
      margin: 0;
    }

    .app-footer .author {
      color: var(--accent-gold);
      font-weight: 700;
      letter-spacing: 1.5px;
    }

    .app-footer .divider {
      color: rgba(253, 252, 240, 0.3);
      margin: 0 0.4rem;
      font-weight: 300;
    }

    .app-footer .website-link {
      color: var(--accent-gold);
      text-decoration: none;
      transition: color 0.3s ease;
      font-weight: 700;
      letter-spacing: 1.5px;
    }
    
    .app-footer .website-link:hover {
      color: rgba(253, 252, 240, 0.9);
      text-decoration: none;
    }

    .hero-section {
      background: linear-gradient(135deg, #0f2e1b 0%, #154522 50%, #0b2212 100%);
      padding: 7rem 1rem 22rem 1rem;
      text-align: center;
      position: relative;
      z-index: 0;
      overflow: hidden;
      box-shadow: inset 0 -40px 60px rgba(0,0,0,0.2);
    }
    
    .hero-section::after {
      content: '';
      position: absolute;
      top: -50%; left: 50%; transform: translateX(-50%);
      width: 120%; height: 1000px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, rgba(0,0,0,0) 60%);
      pointer-events: none;
      z-index: 0;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('https://www.transparenttextures.com/patterns/islamic-art.png');
      opacity: 0.08;
      pointer-events: none;
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      margin: 0 auto;
    }

    .bismillah-svg {
      height: 40px;
      color: rgba(253, 252, 240, 0.85);
      margin-bottom: 0.5rem;
      fill: currentColor;
    }

    h1 {
      color: var(--accent-gold);
      font-family: 'Amiri', serif;
      font-size: 4.5rem;
      margin-bottom: 0.5rem;
      line-height: 1.1;
      text-shadow: 0 4px 20px rgba(0,0,0,0.3);
      font-weight: 700;
    }

    .divider-ornament {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 1rem 0 1.5rem 0;
      color: rgba(253, 252, 240, 0.4);
    }

    .divider-ornament::before, .divider-ornament::after {
      content: '';
      height: 1px;
      width: 60px;
      background: linear-gradient(90deg, transparent, rgba(253, 252, 240, 0.5), transparent);
    }

    .app-logo-container {
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: center;
    }

    .app-logo {
      width: 80px;
      height: 80px;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .app-logo:hover {
      transform: scale(1.1) rotate(5deg);
    }

    .subtitle {
      color: rgba(253, 252, 240, 0.9);
      font-size: 1.25rem;
      font-weight: 300;
      letter-spacing: 0.5px;
      font-style: italic;
      font-family: 'Amiri', serif;
      max-width: 600px;
      margin: 0 auto 3rem auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .source-cite {
      font-size: 0.85rem;
      font-family: 'Inter', sans-serif;
      font-style: normal;
      color: var(--accent-gold);
      opacity: 0.8;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 500;
      margin-top: 0.5rem;
    }

    .animate-fade-in-up {
        animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes fadeInUp {
        to { opacity: 1; transform: translateY(0); }
    }

    .content-section {
      margin-top: -18rem;
      position: relative;
      z-index: 2;
      padding-bottom: 6.5rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .surah-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .surah-card {
      background: var(--surface);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      color: inherit;
      border: 1px solid var(--border-light);
      box-shadow: var(--card-shadow);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .surah-card:hover {
      transform: translateY(-5px);
      border-color: var(--accent-gold);
      box-shadow: var(--card-hover-shadow);
    }

    .card-left {
      display: flex;
      align-items: flex-start;
      gap: 1.2rem;
    }

    .surah-number-badge {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-top: -2px; 
    }

    .surah-number-badge .number {
      position: absolute;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary-deep);
    }

    .surah-name {
      margin: 0;
      font-size: 1.15rem;
      color: var(--text-slate);
    }

    .surah-meaning {
      margin: 0.2rem 0 0 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .card-right {
      text-align: right;
    }

    .surah-arabic-name {
      font-size: 1.5rem;
      color: var(--primary-emerald);
      margin-bottom: 0;
    }

    .surah-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-start;
      margin: 0.2rem 0;
    }

    .dot {
      color: var(--accent-gold);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 5rem 0;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      h1 { font-size: 3rem; }
      .hero-section { padding: 6rem 1rem 16rem 1rem; }
      .content-section { margin-top: -10rem; padding-bottom: 6.5rem; }
      .surah-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SurahListComponent implements OnInit {
  filteredSurahs$!: Observable<Surah[]>;

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<boolean>(false);
  error$ = this.errorSubject.asObservable();

  @ViewChildren('surahCard') surahCards!: QueryList<ElementRef>;

  isScrolling = false;
  scrollTimeout: any;
  activeSurahNumber: number = 1;
  clampedTooltipTop: number = 0;

  tooltipSurah: Surah | null = null;
  tooltipTop: number = 0;

  surahPositions: { number: number, top: number, bottom: number }[] = [];
  surahList: Surah[] = [];

  constructor(private quranService: QuranApiService) { }

  ngOnInit() {
    this.filteredSurahs$ = this.quranService.getSurahs().pipe(
      tap((data) => {
        this.surahList = data;
        this.loadingSubject.next(false);
        setTimeout(() => this.calculateSurahPositions(), 500);
      }),
      catchError((err) => {
        this.errorSubject.next(true);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  calculateSurahPositions() {
    if (!this.surahCards) return;

    this.surahPositions = this.surahCards.map(card => {
      const rect = card.nativeElement.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      return {
        number: parseInt(card.nativeElement.getAttribute('data-surah') || '0'),
        top: absoluteTop,
        bottom: absoluteTop + rect.height
      };
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolling = true;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => this.isScrolling = false, 1000);

    const viewportTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    const scrollPercent = viewportTop / (scrollHeight - viewportHeight);
    this.clampedTooltipTop = Math.max(50, Math.min(viewportHeight - 50, scrollPercent * viewportHeight));

    const triggerPoint = viewportTop + 200;
    const active = this.surahPositions.find(p => triggerPoint >= p.top && triggerPoint <= p.bottom)
      || this.surahPositions.find(p => p.top > triggerPoint);

    if (active) {
      this.activeSurahNumber = active.number;
    }
  }

  onScrollerHover(event: MouseEvent) {
    const mouseY = event.clientY;
    this.tooltipTop = mouseY;

    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (!this.surahPositions.length) return;

    const percentage = Math.max(0, Math.min(1, mouseY / viewportHeight));

    const startTop = this.surahPositions[0].top;
    const endBottom = this.surahPositions[this.surahPositions.length - 1].bottom;

    const targetY = startTop + (percentage * (endBottom - startTop));

    const targetSurah = this.surahPositions.find(p => targetY >= p.top && targetY <= p.bottom)
      || this.surahPositions.find(p => p.top > targetY)
      || this.surahPositions[this.surahPositions.length - 1];

    if (targetSurah) {
      const fullData = this.surahList.find(s => s.nomor === targetSurah.number);
      if (fullData) this.tooltipSurah = fullData;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateSurahPositions();
  }
}
