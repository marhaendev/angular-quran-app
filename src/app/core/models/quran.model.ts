// Equran.id V2 Models

export interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    deskripsi: string;
    audioFull: AudioFull;
}

export interface AudioFull {
    [key: string]: string; // "01", "02", etc.
}

export interface Ayah {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: {
        [key: string]: string; // "01", "02", etc.
    };
}

export interface SurahDetail extends Surah {
    ayat: Ayah[];
    suratSelanjutnya: SurahNextPrev | false;
    suratSebelumnya: SurahNextPrev | false;
}

export interface SurahNextPrev {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
