import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AudioState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    currentUrl: string | null;
    isBuffering: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private audio: HTMLAudioElement;
    private state = new BehaviorSubject<AudioState>({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        currentUrl: null,
        isBuffering: false,
        error: null
    });

    constructor() {
        this.audio = new Audio();
        this.attachListeners();
    }

    private attachListeners() {
        this.audio.addEventListener('timeupdate', () => {
            this.updateState({ currentTime: this.audio.currentTime });
        });

        this.audio.addEventListener('playing', () => {
            this.updateState({ isPlaying: true, isBuffering: false });
        });

        this.audio.addEventListener('pause', () => {
            this.updateState({ isPlaying: false });
        });

        this.audio.addEventListener('ended', () => {
            this.updateState({ isPlaying: false, currentTime: 0 });
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.updateState({ duration: this.audio.duration, isBuffering: false });
        });

        this.audio.addEventListener('waiting', () => {
            this.updateState({ isBuffering: true });
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Audio Error:', e);
            this.updateState({ error: 'Gagal memutar audio', isPlaying: false, isBuffering: false });
        });
    }

    getState(): Observable<AudioState> {
        return this.state.asObservable();
    }

    playUrl(url: string) {
        if (this.state.value.currentUrl === url) {
            this.resume();
            return;
        }

        this.audio.src = url;
        this.audio.load();
        this.updateState({ currentUrl: url, isBuffering: true, error: null });
        this.play();
    }

    play() {
        this.audio.play().catch(err => {
            console.error('Play error:', err);
            this.updateState({ error: 'Gagal memutar audio', isPlaying: false });
        });
    }

    pause() {
        this.audio.pause();
    }

    resume() {
        if (this.audio.src) {
            this.play();
        }
    }

    seek(seconds: number) {
        this.audio.currentTime = seconds;
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
        this.updateState({ isPlaying: false, currentTime: 0, currentUrl: null });
    }

    private updateState(newState: Partial<AudioState>) {
        this.state.next({ ...this.state.value, ...newState });
    }
}
