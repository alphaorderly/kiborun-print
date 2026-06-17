import { Download, Printer } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

import bgImage from '@assets/bg.jpg';
import logoImage from '@assets/logo.png';
import runnerChar1 from '@assets/info-char-1-upscaled.png';
import runnerChar2 from '@assets/info-char-2-upscaled.png';
import runnerChar3 from '@assets/info-char-3-upscaled.png';
import runnerChar4 from '@assets/info-char-4-upscaled.png';
import runnerChar5 from '@assets/info-char-5-upscaled.png';
import runnerChar6 from '@assets/info-char-6-upscaled.png';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select';
import { Slider } from '@components/ui/slider';
import { cn } from '@utils/cn/cn';

const runnerCharacters = [
    { id: 'char-1', label: '스미레', image: runnerChar1 },
    { id: 'char-2', label: '하스미', image: runnerChar2 },
    { id: 'char-3', label: '히나', image: runnerChar3 },
    { id: 'char-4', label: '아리스', image: runnerChar4 },
    { id: 'char-5', label: '이즈나', image: runnerChar5 },
    { id: 'char-6', label: '시로코', image: runnerChar6 },
] as const;

type RunnerCharacterId = (typeof runnerCharacters)[number]['id'];

const fontOptions = [
    {
        id: 'nanum-square-neo',
        label: '나눔스퀘어 네오',
        fontFamily: 'NanumSquareNeo, Pretendard, sans-serif',
    },
    {
        id: 'pretendard',
        label: '프리텐다드',
        fontFamily: 'Pretendard, sans-serif',
    },
    {
        id: 'paperlogy',
        label: '페이퍼로지',
        fontFamily: 'Paperozi, Pretendard, sans-serif',
    },
    {
        id: 'gmarket-sans',
        label: 'Gmarket Sans',
        fontFamily: 'GmarketSans, Pretendard, sans-serif',
    },
    {
        id: 'suit',
        label: 'SUIT',
        fontFamily: 'SUIT, Pretendard, sans-serif',
    },
    {
        id: 'line-seed',
        label: 'LINE Seed',
        fontFamily: '"LINE Seed Sans KR", Pretendard, sans-serif',
    },
    {
        id: 'noto-sans-kr',
        label: 'Noto Sans KR',
        fontFamily: '"Noto Sans KR", Pretendard, sans-serif',
    },
] as const;

type FontFamilyId = (typeof fontOptions)[number]['id'];

const fontOptionById = Object.fromEntries(
    fontOptions.map((option) => [option.id, option])
) as Record<FontFamilyId, (typeof fontOptions)[number]>;

const textStyleOptions = [
    { id: 'balanced', label: '기본', description: '깔끔한 기록증' },
    { id: 'sport', label: '스포츠', description: '강한 시간 강조' },
    { id: 'round', label: '둥근', description: '부드러운 인상' },
    { id: 'arcade', label: '아케이드', description: '게임 카드 느낌' },
] as const;

type TextStyleId = (typeof textStyleOptions)[number]['id'];

const headerAlignmentOptions = [
    { id: 'left', label: '좌' },
    { id: 'center', label: '중' },
    { id: 'right', label: '우' },
] as const;

type HeaderAlignmentId = (typeof headerAlignmentOptions)[number]['id'];

const bibGroupOptions = ['A', 'B', 'C', 'D', 'E'] as const;

type BibGroupId = (typeof bibGroupOptions)[number];

const baseCardSizeMm = {
    width: 54,
    height: 85.6,
} as const;

const outputCardSizeOptions = [
    {
        id: 'record',
        label: '기록증',
        widthMm: 54,
        heightMm: 85.6,
        description: '기본',
    },
    {
        id: 'credit-card',
        label: '신용카드',
        widthMm: 53.98,
        heightMm: 85.6,
        description: '표준 카드',
    },
    {
        id: 'business-card',
        label: '명함',
        widthMm: 55,
        heightMm: 90,
        description: '국내 명함',
    },
    {
        id: 'bridge',
        label: '브릿지',
        widthMm: 57,
        heightMm: 89,
        description: '슬림 카드',
    },
    {
        id: 'poker',
        label: '포커',
        widthMm: 63,
        heightMm: 88,
        description: '보드게임 카드',
    },
    {
        id: 'tarot',
        label: '타로',
        widthMm: 70,
        heightMm: 120,
        description: '대형 카드',
    },
] as const;

type OutputCardSizeId = (typeof outputCardSizeOptions)[number]['id'];

const outputCardSizeById = Object.fromEntries(
    outputCardSizeOptions.map((option) => [option.id, option])
) as Record<OutputCardSizeId, (typeof outputCardSizeOptions)[number]>;

type TextSlotId = 'label' | 'bib' | 'name' | 'course' | 'time';

type TextVerticalOffsets = Record<TextSlotId, number>;

type CardSizeStyle = CSSProperties & {
    '--card-output-width': string;
    '--card-output-height': string;
    '--card-output-offset-x': string;
    '--card-output-offset-y': string;
    '--card-output-scale': string;
};

type RecordCardAssets = {
    bg: HTMLImageElement;
    logo: HTMLImageElement;
    runners: Record<RunnerCharacterId, HTMLImageElement>;
};

type DrawRecordCardOptions = {
    assets: RecordCardAssets;
    heightMm: number;
    offsetX: number;
    offsetY: number;
    outputScale: number;
    pixelRatio: number;
    widthMm: number;
};

type RecordInput = {
    bibGroup: BibGroupId;
    bibNumber: string;
    runnerName: string;
    finishTime: string;
    outputSizeId: OutputCardSizeId;
    fontFamilyId: FontFamilyId;
    textStyleId: TextStyleId;
    logoAlignmentId: HeaderAlignmentId;
    titleAlignmentId: HeaderAlignmentId;
    leftRunnerId: RunnerCharacterId;
    rightRunnerId: RunnerCharacterId;
    leftRunnerPosition: number;
    rightRunnerPosition: number;
    leftRunnerFlipped: boolean;
    rightRunnerFlipped: boolean;
};

const initialRecord: RecordInput = {
    bibGroup: 'A',
    bibNumber: '2313',
    runnerName: '선생님',
    finishTime: '12:13',
    outputSizeId: 'record',
    fontFamilyId: 'nanum-square-neo',
    textStyleId: 'sport',
    logoAlignmentId: 'left',
    titleAlignmentId: 'left',
    leftRunnerId: 'char-1',
    rightRunnerId: 'char-6',
    leftRunnerPosition: -6,
    rightRunnerPosition: -6,
    leftRunnerFlipped: false,
    rightRunnerFlipped: true,
};

const isValidFinishTime = (value: string) =>
    /^(?:(?:\d{1,2}:)?[0-5]?\d:)[0-5]\d$/.test(value.trim());

const sanitizeBibNumber = (value: string) =>
    value.replace(/\D/g, '').slice(0, 4);

const formatFinishTime = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);

    if (digits.length <= 2) {
        return digits;
    }

    if (digits.length <= 4) {
        return `${digits.slice(0, -2)}:${digits.slice(-2)}`;
    }

    return `${digits.slice(0, -4)}:${digits.slice(-4, -2)}:${digits.slice(-2)}`;
};

const sanitizeFileName = (value: string) =>
    value.trim().replace(/[<>:"/\\|?*]/g, '_') || 'runner';

const formatMm = (value: number) => `${Number(value.toFixed(2))}mm`;

const mmToCssPx = (value: number) => (value / 25.4) * 96;

const CANVAS_PX_PER_MM = 96 / 25.4;

const PREVIEW_PIXEL_RATIO_CAP = 2;

const EXPORT_PIXEL_RATIO = 3.125;

const zeroTextVerticalOffsets: TextVerticalOffsets = {
    label: 0,
    bib: 0,
    name: 0,
    course: 0,
    time: 0,
};

const verticalOffsetByFont: Record<FontFamilyId, TextVerticalOffsets> = {
    'nanum-square-neo': zeroTextVerticalOffsets,
    pretendard: {
        label: -0.2,
        bib: 0.05,
        name: 0.08,
        course: 0.5,
        time: 0.08,
    },
    paperlogy: {
        label: -0.02,
        bib: -0.04,
        name: -0.05,
        course: 0,
        time: 0.3,
    },
    'gmarket-sans': {
        label: -0.1,
        bib: 0,
        name: 0.18,
        course: 0,
        time: 0.2,
    },
    suit: {
        label: 0.02,
        bib: 0.06,
        name: 0.04,
        course: 0.2,
        time: -0.0,
    },
    'line-seed': {
        label: -0.1,
        bib: 0,
        name: 0,
        course: 0,
        time: 0,
    },
    'noto-sans-kr': {
        label: 0,
        bib: 0,
        name: 0,
        course: 0,
        time: 0,
    },
};

const textVerticalOffsetSignature = JSON.stringify(verticalOffsetByFont);

const getTextVerticalOffset = (fontFamilyId: FontFamilyId, slot: TextSlotId) =>
    verticalOffsetByFont[fontFamilyId][slot];

const recordCardStyles = {
    frame: 'relative h-[calc(var(--card-output-height)*var(--card-preview-scale))] w-[calc(var(--card-output-width)*var(--card-preview-scale))] overflow-hidden [--card-preview-scale:1] [filter:drop-shadow(0_24px_48px_rgb(15_23_42_/_22%))] [print-color-adjust:exact] max-[360px]:[--card-preview-scale:0.82] min-[680px]:[--card-preview-scale:1.45] min-[1050px]:[--card-preview-scale:1.82] [-webkit-print-color-adjust:exact] print:block print:h-[var(--card-output-height)] print:w-[var(--card-output-width)] print:[--card-preview-scale:1] print:filter-none',
    canvas: 'block h-full w-full',
} as const;

type CanvasTextOptions = {
    align?: CanvasTextAlign;
    fill: string;
    fontFamily: string;
    fontSizeMm: number;
    fontWeight: number;
    letterSpacingMm?: number;
    maxWidthMm?: number;
    shadow?: {
        blur: number;
        color: string;
        offsetX: number;
        offsetY: number;
    };
    strokeColor?: string;
    strokeWidthMm?: number;
    text: string;
    x: number;
    y: number;
};

let recordCardAssetsPromise: Promise<RecordCardAssets> | null = null;

const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
            if (image.decode) {
                void image.decode().finally(() => resolve(image));
                return;
            }

            resolve(image);
        };
        image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        image.src = src;
    });

const loadRecordCardAssets = () => {
    recordCardAssetsPromise ??= Promise.all([
        loadImage(bgImage),
        loadImage(logoImage),
        ...runnerCharacters.map((character) => loadImage(character.image)),
    ]).then(([bg, logo, ...runnerImages]) => {
        const runners = Object.fromEntries(
            runnerCharacters.map((character, index) => [
                character.id,
                runnerImages[index] as HTMLImageElement,
            ])
        ) as Record<RunnerCharacterId, HTMLImageElement>;

        return { bg, logo, runners };
    });

    return recordCardAssetsPromise;
};

const waitForFontFamily = async (fontFamily: string) => {
    if (!('fonts' in document)) {
        return;
    }

    await Promise.all(
        [400, 700, 800, 900].map((weight) =>
            document.fonts.load(`${weight} 16px ${fontFamily}`)
        )
    );
    await document.fonts.ready;
};

const resetCanvasEffects = (ctx: CanvasRenderingContext2D) => {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
};

const roundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) => {
    const nextRadius = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + nextRadius, y);
    ctx.lineTo(x + width - nextRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + nextRadius);
    ctx.lineTo(x + width, y + height - nextRadius);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - nextRadius,
        y + height
    );
    ctx.lineTo(x + nextRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - nextRadius);
    ctx.lineTo(x, y + nextRadius);
    ctx.quadraticCurveTo(x, y, x + nextRadius, y);
    ctx.closePath();
};

const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    positionX = 0.5,
    positionY = 0.5
) => {
    const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight
    );
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (image.naturalWidth - sourceWidth) * positionX;
    const sourceY = (image.naturalHeight - sourceHeight) * positionY;

    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        x,
        y,
        width,
        height
    );
};

const setCanvasFont = (
    ctx: CanvasRenderingContext2D,
    fontWeight: number,
    fontSizeMm: number,
    fontFamily: string
) => {
    ctx.font = `${fontWeight} ${fontSizeMm}px ${fontFamily}`;
};

const measureCanvasText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    letterSpacingMm = 0
) => {
    const characters = Array.from(text);

    return (
        ctx.measureText(text).width +
        Math.max(0, characters.length - 1) * letterSpacingMm
    );
};

const drawTextRun = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    letterSpacingMm: number,
    draw: (part: string, x: number) => void
) => {
    if (letterSpacingMm === 0) {
        draw(text, x);
        return;
    }

    let cursor = x;

    for (const character of Array.from(text)) {
        draw(character, cursor);
        cursor += ctx.measureText(character).width + letterSpacingMm;
    }
};

const getGlyphCenteredBaselineY = (metrics: TextMetrics, centerY: number) => {
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = metrics;

    if (
        !Number.isFinite(actualBoundingBoxAscent) ||
        !Number.isFinite(actualBoundingBoxDescent) ||
        (actualBoundingBoxAscent === 0 && actualBoundingBoxDescent === 0)
    ) {
        return null;
    }

    return centerY + (actualBoundingBoxAscent - actualBoundingBoxDescent) / 2;
};

const drawCanvasText = (
    ctx: CanvasRenderingContext2D,
    options: CanvasTextOptions
) => {
    const {
        align = 'center',
        fill,
        fontFamily,
        fontWeight,
        letterSpacingMm = 0,
        maxWidthMm,
        shadow,
        strokeColor,
        strokeWidthMm = 0,
        text,
        x,
        y,
    } = options;
    let fontSizeMm = options.fontSizeMm;

    setCanvasFont(ctx, fontWeight, fontSizeMm, fontFamily);

    if (maxWidthMm) {
        while (
            measureCanvasText(ctx, text, letterSpacingMm) > maxWidthMm &&
            fontSizeMm > 1.8
        ) {
            fontSizeMm = Math.max(1.8, fontSizeMm - 0.05);
            setCanvasFont(ctx, fontWeight, fontSizeMm, fontFamily);
        }
    }

    const measuredWidth = measureCanvasText(ctx, text, letterSpacingMm);
    const startX =
        align === 'left'
            ? x
            : align === 'right'
              ? x - measuredWidth
              : x - measuredWidth / 2;

    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = fill;
    ctx.lineJoin = 'round';

    const baselineY = getGlyphCenteredBaselineY(ctx.measureText(text), y);
    const drawY = baselineY ?? y;

    ctx.textBaseline = baselineY === null ? 'middle' : 'alphabetic';

    if (shadow) {
        ctx.shadowBlur = shadow.blur;
        ctx.shadowColor = shadow.color;
        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
    }

    if (strokeColor && strokeWidthMm > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidthMm;
        drawTextRun(ctx, text, startX, letterSpacingMm, (part, partX) => {
            ctx.strokeText(part, partX, drawY);
        });
    }

    drawTextRun(ctx, text, startX, letterSpacingMm, (part, partX) => {
        ctx.fillText(part, partX, drawY);
    });
    ctx.restore();
};

const getTextStyle = (textStyleId: TextStyleId) => {
    switch (textStyleId) {
        case 'sport':
            return {
                bibWeight: 800,
                labelColor: '#51363a',
                nameWeight: 900,
                timeColor: '#3f3236',
                timeWeight: 900,
            };
        case 'round':
            return {
                bibWeight: 700,
                labelColor: '#5b4a52',
                nameWeight: 700,
                timeColor: '#554249',
                timeWeight: 700,
            };
        case 'arcade':
            return {
                bibWeight: 900,
                labelColor: '#322b3a',
                nameWeight: 900,
                timeColor: '#302a3a',
                timeWeight: 900,
            };
        case 'balanced':
            return {
                bibWeight: 700,
                labelColor: '#4d3a3e',
                nameWeight: 800,
                timeColor: '#45373a',
                timeWeight: 800,
            };
    }
};

const getAlignedX = (
    alignment: HeaderAlignmentId,
    left: number,
    width: number,
    contentWidth: number
) => {
    if (alignment === 'center') {
        return left + (width - contentWidth) / 2;
    }

    if (alignment === 'right') {
        return left + width - contentWidth;
    }

    return left;
};

const drawHeader = (
    ctx: CanvasRenderingContext2D,
    record: RecordInput,
    assets: RecordCardAssets,
    fontFamily: string
) => {
    const horizontalPadding = 5.7;
    const logoWidth = 36;
    const logoHeight =
        logoWidth * (assets.logo.naturalHeight / assets.logo.naturalWidth);
    const logoX = getAlignedX(
        record.logoAlignmentId,
        horizontalPadding,
        54 - horizontalPadding * 2,
        logoWidth
    );
    const logoY = 7;

    ctx.drawImage(assets.logo, logoX, logoY, logoWidth, logoHeight);

    const titleAlign = record.titleAlignmentId;
    const titleX =
        titleAlign === 'center'
            ? 27
            : titleAlign === 'right'
              ? 54 - horizontalPadding
              : horizontalPadding;

    drawCanvasText(ctx, {
        align: titleAlign,
        fill: '#3c3838',
        fontFamily,
        fontSizeMm: 6.1,
        fontWeight: 900,
        letterSpacingMm: 0.06,
        shadow: {
            blur: 0.72,
            color: 'rgb(92 58 48 / 0.23)',
            offsetX: 0,
            offsetY: 0.55,
        },
        strokeColor: 'rgb(255 255 255 / 0.9)',
        strokeWidthMm: 0.68,
        text: '완주 기록증',
        x: titleX,
        y: logoY + logoHeight + 5.5,
    });
};

const drawTrack = (ctx: CanvasRenderingContext2D) => {
    const trackGradient = ctx.createLinearGradient(0, 74.7, 0, 83.3);
    trackGradient.addColorStop(0, 'rgb(129 186 207 / 0.66)');
    trackGradient.addColorStop(1, 'rgb(82 150 181 / 0.48)');

    roundedRect(ctx, 2.8, 74.7, 48.4, 8.6, 4.3);
    ctx.fillStyle = trackGradient;
    ctx.globalAlpha = 0.68;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgb(255 219 108 / 0.58)';
    ctx.lineWidth = 0.22;
    [10.8, 23.3, 36.7].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 75.2);
        ctx.lineTo(x + 5.6, 82.8);
        ctx.stroke();
    });
};

const drawPanel = (
    ctx: CanvasRenderingContext2D,
    record: RecordInput,
    fontFamily: string
) => {
    const textStyle = getTextStyle(record.textStyleId);
    const panel = { x: 5.2, y: 31.4, width: 43.6, height: 42.4 };
    const labelHeight = 4.6;
    const bibHeight = 6.6;
    const nameHeight = 12.7;
    const courseHeight = 5;
    const timeHeight = 13.5;

    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgb(37 89 116 / 0.18)';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1.7;
    roundedRect(ctx, panel.x, panel.y, panel.width, panel.height, 2.2);
    ctx.fillStyle = 'rgb(255 255 255 / 0.92)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundedRect(ctx, panel.x, panel.y, panel.width, panel.height, 2.2);
    ctx.clip();

    const yellowGradient = ctx.createLinearGradient(
        0,
        panel.y,
        0,
        panel.y + labelHeight
    );
    yellowGradient.addColorStop(0, '#fff08d');
    yellowGradient.addColorStop(1, '#ffd85a');

    ctx.fillStyle = yellowGradient;
    ctx.fillRect(panel.x, panel.y, panel.width, labelHeight);

    const bibY = panel.y + labelHeight;
    const nameY = bibY + bibHeight;
    const courseY = nameY + nameHeight;
    const timeY = courseY + courseHeight;

    ctx.fillStyle = 'rgb(255 255 255 / 0.92)';
    ctx.fillRect(panel.x, bibY, panel.width, bibHeight);
    ctx.fillRect(panel.x, nameY, panel.width, nameHeight);

    const courseGradient = ctx.createLinearGradient(
        0,
        courseY,
        0,
        courseY + courseHeight
    );
    courseGradient.addColorStop(0, '#fff08d');
    courseGradient.addColorStop(1, '#ffd85a');
    ctx.fillStyle = courseGradient;
    ctx.fillRect(panel.x, courseY, panel.width, courseHeight);

    ctx.fillStyle = 'rgb(255 255 255 / 0.92)';
    ctx.fillRect(panel.x, timeY, panel.width, timeHeight);

    ctx.strokeStyle = 'rgb(255 218 95 / 0.72)';
    ctx.lineWidth = 0.25;
    [nameY, courseY, timeY].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(panel.x, y);
        ctx.lineTo(panel.x + panel.width, y);
        ctx.stroke();
    });

    const centerX = panel.x + panel.width / 2;

    drawCanvasText(ctx, {
        fill: textStyle.labelColor,
        fontFamily,
        fontSizeMm: 2.45,
        fontWeight: 700,
        letterSpacingMm: 0.2,
        shadow: {
            blur: 0.18,
            color: 'rgb(255 255 255 / 0.56)',
            offsetX: 0,
            offsetY: 0.11,
        },
        text: '번호',
        x: centerX,
        y:
            panel.y +
            labelHeight / 2 +
            getTextVerticalOffset(record.fontFamilyId, 'label'),
    });

    drawCanvasText(ctx, {
        fill: '#4a373a',
        fontFamily,
        fontSizeMm: 4.35,
        fontWeight: textStyle.bibWeight,
        letterSpacingMm: 0.36,
        maxWidthMm: panel.width - 3,
        shadow: {
            blur: 0.2,
            color: 'rgb(255 255 255 / 0.5)',
            offsetX: 0,
            offsetY: 0.14,
        },
        strokeColor: 'rgb(255 255 255 / 0.38)',
        strokeWidthMm: 0.11,
        text: `${record.bibGroup}${record.bibNumber || '0000'}`,
        x: centerX,
        y:
            bibY +
            bibHeight / 2 +
            getTextVerticalOffset(record.fontFamilyId, 'bib'),
    });

    drawCanvasText(ctx, {
        fill: record.textStyleId === 'round' ? '#59464d' : '#4b3a3d',
        fontFamily,
        fontSizeMm: 5.6,
        fontWeight: textStyle.nameWeight,
        letterSpacingMm: record.textStyleId === 'arcade' ? 0.16 : 0.06,
        maxWidthMm: panel.width - 3,
        shadow: {
            blur: 0.24,
            color: 'rgb(255 255 255 / 0.38)',
            offsetX: 0,
            offsetY: 0.12,
        },
        strokeColor:
            record.textStyleId === 'arcade'
                ? 'rgb(255 241 174 / 0.72)'
                : 'rgb(255 255 255 / 0.42)',
        strokeWidthMm: record.textStyleId === 'arcade' ? 0.2 : 0.15,
        text: record.runnerName || '이름',
        x: centerX,
        y:
            nameY +
            nameHeight / 2 +
            getTextVerticalOffset(record.fontFamilyId, 'name'),
    });

    drawCanvasText(ctx, {
        fill: textStyle.labelColor,
        fontFamily,
        fontSizeMm: 3.15,
        fontWeight: record.textStyleId === 'sport' ? 800 : 700,
        letterSpacingMm: 0.12,
        shadow: {
            blur: 0.18,
            color: 'rgb(255 255 255 / 0.56)',
            offsetX: 0,
            offsetY: 0.11,
        },
        text: '5km',
        x: centerX,
        y:
            courseY +
            courseHeight / 2 +
            getTextVerticalOffset(record.fontFamilyId, 'course'),
    });

    drawCanvasText(ctx, {
        fill: textStyle.timeColor,
        fontFamily,
        fontSizeMm: 8.9,
        fontWeight: textStyle.timeWeight,
        letterSpacingMm: record.textStyleId === 'round' ? -0.02 : -0.08,
        maxWidthMm: panel.width - 2,
        shadow: {
            blur: 0.24,
            color: 'rgb(255 255 255 / 0.5)',
            offsetX: 0,
            offsetY: 0.16,
        },
        strokeColor:
            record.textStyleId === 'arcade'
                ? 'rgb(255 241 174 / 0.72)'
                : 'rgb(255 255 255 / 0.5)',
        strokeWidthMm: record.textStyleId === 'arcade' ? 0.2 : 0.18,
        text: record.finishTime || '00:00',
        x: centerX,
        y:
            timeY +
            timeHeight / 2 +
            getTextVerticalOffset(record.fontFamilyId, 'time'),
    });

    resetCanvasEffects(ctx);
    ctx.restore();

    roundedRect(ctx, panel.x, panel.y, panel.width, panel.height, 2.2);
    ctx.strokeStyle = 'rgb(255 218 95 / 0.95)';
    ctx.lineWidth = 0.35;
    ctx.stroke();
};

const drawRunner = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    height: number,
    flipped = false
) => {
    const width = height * (image.naturalWidth / image.naturalHeight);

    ctx.save();
    ctx.shadowBlur = 0.5;
    ctx.shadowColor = 'rgb(60 45 48 / 0.2)';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0.6;

    if (flipped) {
        ctx.translate(x + width / 2, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, -width / 2, y, width, height);
    } else {
        ctx.drawImage(image, x, y, width, height);
    }

    ctx.restore();
};

const drawRecordCard = (
    ctx: CanvasRenderingContext2D,
    record: RecordInput,
    options: DrawRecordCardOptions
) => {
    const {
        assets,
        heightMm,
        offsetX,
        offsetY,
        outputScale,
        pixelRatio,
        widthMm,
    } = options;
    const fontFamily = fontOptionById[record.fontFamilyId].fontFamily;
    const outputWidth = mmToCssPx(widthMm) * pixelRatio;
    const outputHeight = mmToCssPx(heightMm) * pixelRatio;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, outputWidth, outputHeight);
    resetCanvasEffects(ctx);

    ctx.setTransform(
        CANVAS_PX_PER_MM * pixelRatio,
        0,
        0,
        CANVAS_PX_PER_MM * pixelRatio,
        0,
        0
    );
    ctx.translate(offsetX, offsetY);
    ctx.scale(outputScale, outputScale);

    ctx.save();
    roundedRect(ctx, 0, 0, baseCardSizeMm.width, baseCardSizeMm.height, 3);
    ctx.clip();
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(0, 0, baseCardSizeMm.width, baseCardSizeMm.height);
    drawImageCover(
        ctx,
        assets.bg,
        0,
        0,
        baseCardSizeMm.width,
        baseCardSizeMm.height,
        0.49,
        0
    );

    const glowGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        baseCardSizeMm.height
    );
    glowGradient.addColorStop(0, 'rgb(99 207 255 / 0.3)');
    glowGradient.addColorStop(0.42, 'rgb(255 255 255 / 0.08)');
    glowGradient.addColorStop(1, 'rgb(255 236 159 / 0.2)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, baseCardSizeMm.width, baseCardSizeMm.height);

    const topGlow = ctx.createRadialGradient(27, 9.4, 0, 27, 9.4, 8.8);
    topGlow.addColorStop(0, 'rgb(255 255 255 / 0.8)');
    topGlow.addColorStop(1, 'rgb(255 255 255 / 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, baseCardSizeMm.width, baseCardSizeMm.height);

    const sideGlow = ctx.createRadialGradient(42.1, 30, 0, 42.1, 30, 13);
    sideGlow.addColorStop(0, 'rgb(255 255 255 / 0.45)');
    sideGlow.addColorStop(1, 'rgb(255 255 255 / 0)');
    ctx.fillStyle = sideGlow;
    ctx.fillRect(0, 0, baseCardSizeMm.width, baseCardSizeMm.height);

    drawHeader(ctx, record, assets, fontFamily);
    drawTrack(ctx);
    drawPanel(ctx, record, fontFamily);

    ctx.restore();

    const runnerHeight = 18.5;
    const runnerY = baseCardSizeMm.height - 3 - runnerHeight;
    const leftRunner = assets.runners[record.leftRunnerId];
    const rightRunner = assets.runners[record.rightRunnerId];
    const rightRunnerWidth =
        runnerHeight * (rightRunner.naturalWidth / rightRunner.naturalHeight);

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    resetCanvasEffects(ctx);
    drawRunner(
        ctx,
        leftRunner,
        record.leftRunnerPosition,
        runnerY,
        runnerHeight,
        record.leftRunnerFlipped
    );
    drawRunner(
        ctx,
        rightRunner,
        baseCardSizeMm.width - record.rightRunnerPosition - rightRunnerWidth,
        runnerY,
        runnerHeight,
        record.rightRunnerFlipped
    );

    roundedRect(
        ctx,
        1.38,
        1.38,
        baseCardSizeMm.width - 2.76,
        baseCardSizeMm.height - 2.76,
        2.35
    );
    ctx.strokeStyle = 'rgb(255 255 255 / 0.9)';
    ctx.lineWidth = 0.18;
    ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
};

const FieldError = ({ children }: { children: string }) => (
    <p className="text-destructive text-sm font-medium">{children}</p>
);

const FontPicker = ({
    selectedId,
    onSelect,
}: {
    selectedId: FontFamilyId;
    onSelect: (id: FontFamilyId) => void;
}) => (
    <div className="grid gap-2">
        <Label>카드 폰트</Label>
        <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="카드 폰트"
        >
            {fontOptions.map((option) => {
                const isSelected = option.id === selectedId;

                return (
                    <Button
                        key={option.id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'h-auto justify-start px-3 py-2 text-left',
                            isSelected &&
                                'border-primary bg-primary/10 text-primary shadow-sm'
                        )}
                        style={{ fontFamily: option.fontFamily }}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onSelect(option.id)}
                    >
                        {option.label}
                    </Button>
                );
            })}
        </div>
    </div>
);

const TextStylePicker = ({
    selectedId,
    onSelect,
}: {
    selectedId: TextStyleId;
    onSelect: (id: TextStyleId) => void;
}) => (
    <div className="grid gap-2">
        <Label>글자 스타일</Label>
        <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="글자 스타일"
        >
            {textStyleOptions.map((option) => {
                const isSelected = option.id === selectedId;

                return (
                    <Button
                        key={option.id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'h-auto flex-col items-start gap-0.5 px-3 py-2',
                            isSelected &&
                                'border-primary bg-primary/10 text-primary shadow-sm'
                        )}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onSelect(option.id)}
                    >
                        <span className="text-sm leading-tight font-bold">
                            {option.label}
                        </span>
                        <span className="text-muted-foreground text-xs leading-tight">
                            {option.description}
                        </span>
                    </Button>
                );
            })}
        </div>
    </div>
);

const HeaderAlignmentPicker = ({
    label,
    selectedId,
    onSelect,
}: {
    label: string;
    selectedId: HeaderAlignmentId;
    onSelect: (id: HeaderAlignmentId) => void;
}) => (
    <div className="grid gap-2">
        <Label>{label}</Label>
        <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label={label}
        >
            {headerAlignmentOptions.map((option) => {
                const isSelected = option.id === selectedId;

                return (
                    <Button
                        key={option.id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'h-auto justify-center px-3 py-2 font-bold',
                            isSelected &&
                                'border-primary bg-primary/10 text-primary shadow-sm'
                        )}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onSelect(option.id)}
                    >
                        {option.label}
                    </Button>
                );
            })}
        </div>
    </div>
);

const CardSizePicker = ({
    selectedId,
    onSelect,
}: {
    selectedId: OutputCardSizeId;
    onSelect: (id: OutputCardSizeId) => void;
}) => (
    <div className="grid gap-2">
        <Label>출력 사이즈</Label>
        <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="출력 사이즈"
        >
            {outputCardSizeOptions.map((option) => {
                const isSelected = option.id === selectedId;

                return (
                    <Button
                        key={option.id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'h-auto flex-col items-start gap-1 px-3 py-2 text-left',
                            isSelected &&
                                'border-primary bg-primary/10 text-primary shadow-sm'
                        )}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onSelect(option.id)}
                    >
                        <span className="text-sm leading-tight font-bold">
                            {option.label}
                        </span>
                        <span className="text-muted-foreground grid gap-0.5 text-xs leading-tight">
                            <span>
                                {formatMm(option.widthMm)} x{' '}
                                {formatMm(option.heightMm)}
                            </span>
                            <span>{option.description}</span>
                        </span>
                    </Button>
                );
            })}
        </div>
    </div>
);

const CharacterPicker = ({
    label,
    selectedId,
    onSelect,
}: {
    label: string;
    selectedId: RunnerCharacterId;
    onSelect: (id: RunnerCharacterId) => void;
}) => (
    <div className="grid gap-2">
        <Label>{label}</Label>
        <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label={label}
        >
            {runnerCharacters.map((character) => {
                const isSelected = character.id === selectedId;

                return (
                    <Button
                        key={character.id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'h-16 flex-col gap-1 p-2',
                            isSelected &&
                                'border-primary bg-primary/10 text-primary shadow-sm'
                        )}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${label} 캐릭터 ${character.label}`}
                        onClick={() => onSelect(character.id)}
                    >
                        <img
                            className="h-9 w-auto object-contain"
                            src={character.image}
                            alt=""
                            aria-hidden="true"
                        />
                        <span className="text-[11px] leading-none">
                            {character.label}
                        </span>
                    </Button>
                );
            })}
        </div>
    </div>
);

const RunnerFlipPicker = ({
    label,
    flipped,
    onChange,
}: {
    label: string;
    flipped: boolean;
    onChange: (flipped: boolean) => void;
}) => (
    <div className="grid gap-2">
        <Label>{label}</Label>
        <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label={label}
        >
            {(
                [
                    { id: false, label: '기본' },
                    { id: true, label: '반전' },
                ] as const
            ).map((option) => {
                const isSelected = option.id === flipped;

                return (
                    <Button
                        key={option.label}
                        type="button"
                        variant="outline"
                        className={cn(
                            'h-auto justify-center px-3 py-2 font-bold',
                            isSelected &&
                                'border-primary bg-primary/10 text-primary shadow-sm'
                        )}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onChange(option.id)}
                    >
                        {option.label}
                    </Button>
                );
            })}
        </div>
    </div>
);

const RunnerPositionSlider = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) => (
    <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
            <Label>{label}</Label>
            <span className="text-muted-foreground text-sm font-medium">
                {value.toFixed(1)}mm
            </span>
        </div>
        <Slider
            min={-16}
            max={8}
            step={0.5}
            value={[value]}
            onValueChange={(nextValue) => {
                onChange(nextValue[0] ?? value);
            }}
        />
    </div>
);

const setCanvasSize = (
    canvas: HTMLCanvasElement,
    widthMm: number,
    heightMm: number,
    pixelRatio: number
) => {
    const width = Math.round(mmToCssPx(widthMm) * pixelRatio);
    const height = Math.round(mmToCssPx(heightMm) * pixelRatio);

    if (canvas.width !== width) {
        canvas.width = width;
    }

    if (canvas.height !== height) {
        canvas.height = height;
    }
};

const renderRecordCardToCanvas = async (
    canvas: HTMLCanvasElement,
    record: RecordInput,
    options: Omit<DrawRecordCardOptions, 'assets'>
) => {
    const [assets] = await Promise.all([
        loadRecordCardAssets(),
        waitForFontFamily(fontOptionById[record.fontFamilyId].fontFamily),
    ]);
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Canvas 2D context is not available.');
    }

    setCanvasSize(
        canvas,
        options.widthMm,
        options.heightMm,
        options.pixelRatio
    );
    drawRecordCard(context, record, { ...options, assets });
};

const canvasToPngBlob = (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve, reject) => {
        if (canvas.toBlob) {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                    return;
                }

                reject(new Error('Failed to create PNG blob.'));
            }, 'image/png');
            return;
        }

        try {
            const [metadata, content] = canvas
                .toDataURL('image/png')
                .split(',');
            const mime =
                metadata?.match(/data:(.*);base64/)?.[1] ?? 'image/png';
            const binary = window.atob(content ?? '');
            const bytes = new Uint8Array(binary.length);

            for (let index = 0; index < binary.length; index += 1) {
                bytes[index] = binary.charCodeAt(index);
            }

            resolve(new Blob([bytes], { type: mime }));
        } catch (error) {
            reject(error);
        }
    });

const isIosLikeBrowser = () =>
    /iP(ad|hone|od)/.test(window.navigator.userAgent) ||
    (window.navigator.platform === 'MacIntel' &&
        window.navigator.maxTouchPoints > 1);

const savePngBlob = (
    blob: Blob,
    fileName: string,
    fallbackWindow: Window | null
) => {
    const url = URL.createObjectURL(blob);

    if (fallbackWindow) {
        fallbackWindow.location.href = url;
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
        return;
    }

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

const RecordCardCanvas = ({
    heightMm,
    offsetX,
    offsetY,
    outputScale,
    record,
    widthMm,
}: {
    heightMm: number;
    offsetX: number;
    offsetY: number;
    outputScale: number;
    record: RecordInput;
    widthMm: number;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let isCanceled = false;
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            PREVIEW_PIXEL_RATIO_CAP
        );

        void (async () => {
            const [assets] = await Promise.all([
                loadRecordCardAssets(),
                waitForFontFamily(
                    fontOptionById[record.fontFamilyId].fontFamily
                ),
            ]);

            if (isCanceled) {
                return;
            }

            const context = canvas.getContext('2d');

            if (!context) {
                return;
            }

            setCanvasSize(canvas, widthMm, heightMm, pixelRatio);
            drawRecordCard(context, record, {
                assets,
                heightMm,
                offsetX,
                offsetY,
                outputScale,
                pixelRatio,
                widthMm,
            });
        })();

        return () => {
            isCanceled = true;
        };
    }, [
        heightMm,
        offsetX,
        offsetY,
        outputScale,
        record,
        widthMm,
        textVerticalOffsetSignature,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={recordCardStyles.canvas}
            role="img"
            aria-label="완주 기록증"
        />
    );
};

const App = () => {
    const [record, setRecord] = useState<RecordInput>(initialRecord);
    const [isSaving, setIsSaving] = useState(false);
    const selectedCardSize = outputCardSizeById[record.outputSizeId];
    const outputCardScale = Math.min(
        selectedCardSize.widthMm / baseCardSizeMm.width,
        selectedCardSize.heightMm / baseCardSizeMm.height
    );
    const outputOffsetX =
        (selectedCardSize.widthMm - baseCardSizeMm.width * outputCardScale) / 2;
    const outputOffsetY =
        (selectedCardSize.heightMm - baseCardSizeMm.height * outputCardScale) /
        2;
    const cardSizeStyle: CardSizeStyle = {
        '--card-output-width': formatMm(selectedCardSize.widthMm),
        '--card-output-height': formatMm(selectedCardSize.heightMm),
        '--card-output-offset-x': formatMm(outputOffsetX),
        '--card-output-offset-y': formatMm(outputOffsetY),
        '--card-output-scale': String(outputCardScale),
    };

    const bibError = record.bibNumber.length !== 4;
    const nameError = record.runnerName.trim().length === 0;
    const timeError = !isValidFinishTime(record.finishTime);
    const hasError = bibError || nameError || timeError;

    const updateRecord = <Key extends keyof RecordInput>(
        key: Key,
        value: RecordInput[Key]
    ) => {
        setRecord((prev) => ({ ...prev, [key]: value }));
    };

    const handleDownload = async () => {
        if (hasError) {
            return;
        }

        setIsSaving(true);
        const fallbackWindow = isIosLikeBrowser()
            ? window.open('', '_blank')
            : null;

        try {
            const exportCanvas = document.createElement('canvas');

            await renderRecordCardToCanvas(exportCanvas, record, {
                heightMm: selectedCardSize.heightMm,
                offsetX: outputOffsetX,
                offsetY: outputOffsetY,
                outputScale: outputCardScale,
                pixelRatio: EXPORT_PIXEL_RATIO,
                widthMm: selectedCardSize.widthMm,
            });

            const blob = await canvasToPngBlob(exportCanvas);
            const fileName = `kivotos-run-${record.bibNumber}-${sanitizeFileName(record.runnerName)}-${selectedCardSize.widthMm}x${selectedCardSize.heightMm}mm.png`;

            savePngBlob(blob, fileName, fallbackWindow);
        } catch (error) {
            fallbackWindow?.close();
            console.error(error);
            window.alert('이미지 저장에 실패했어요. 다시 시도해 주세요.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main
            className="bg-background text-foreground min-h-screen overflow-hidden print:min-h-[var(--card-output-height)] print:w-[var(--card-output-width)]"
            style={cardSizeStyle}
        >
            <style>
                {`@page { size: ${formatMm(selectedCardSize.widthMm)} ${formatMm(selectedCardSize.heightMm)}; margin: 0; }
@media print { html, body, #root { width: ${formatMm(selectedCardSize.widthMm)}; height: ${formatMm(selectedCardSize.heightMm)}; } }`}
            </style>
            <div className="mx-auto grid min-h-screen w-[min(1120px,100%)] grid-cols-[minmax(280px,360px)_minmax(0,1fr)] items-center gap-8 p-6 max-[900px]:grid-cols-1 max-[900px]:content-start md:p-10 print:block print:min-h-[var(--card-output-height)] print:w-[var(--card-output-width)] print:p-0">
                <Card className="max-[900px]:order-2 print:hidden">
                    <CardHeader>
                        <CardTitle>기록증 생성</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        <FontPicker
                            selectedId={record.fontFamilyId}
                            onSelect={(fontFamilyId) =>
                                updateRecord('fontFamilyId', fontFamilyId)
                            }
                        />

                        <TextStylePicker
                            selectedId={record.textStyleId}
                            onSelect={(textStyleId) =>
                                updateRecord('textStyleId', textStyleId)
                            }
                        />

                        <CardSizePicker
                            selectedId={record.outputSizeId}
                            onSelect={(outputSizeId) =>
                                updateRecord('outputSizeId', outputSizeId)
                            }
                        />

                        <HeaderAlignmentPicker
                            label="로고 정렬"
                            selectedId={record.logoAlignmentId}
                            onSelect={(logoAlignmentId) =>
                                updateRecord('logoAlignmentId', logoAlignmentId)
                            }
                        />

                        <HeaderAlignmentPicker
                            label="글자 정렬"
                            selectedId={record.titleAlignmentId}
                            onSelect={(titleAlignmentId) =>
                                updateRecord(
                                    'titleAlignmentId',
                                    titleAlignmentId
                                )
                            }
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="bib-number">배번</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={record.bibGroup}
                                    onValueChange={(bibGroup) =>
                                        updateRecord(
                                            'bibGroup',
                                            bibGroup as BibGroupId
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="bib-group"
                                        className="w-[5.5rem] shrink-0"
                                        aria-label="조 선택"
                                    >
                                        <SelectValue placeholder="조" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bibGroupOptions.map((group) => (
                                            <SelectItem
                                                key={group}
                                                value={group}
                                            >
                                                {group}조
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="bib-number"
                                    className="min-w-0 flex-1"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={record.bibNumber}
                                    onChange={(event) =>
                                        updateRecord(
                                            'bibNumber',
                                            sanitizeBibNumber(
                                                event.target.value
                                            )
                                        )
                                    }
                                    placeholder="2313"
                                />
                            </div>
                            {bibError && <FieldError>숫자 4자리</FieldError>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="runner-name">이름</Label>
                            <Input
                                id="runner-name"
                                value={record.runnerName}
                                onChange={(event) =>
                                    updateRecord(
                                        'runnerName',
                                        event.target.value
                                    )
                                }
                                placeholder="선생님"
                            />
                            {nameError && <FieldError>이름 필요</FieldError>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="finish-time">완주 시간</Label>
                            <Input
                                id="finish-time"
                                inputMode="numeric"
                                maxLength={8}
                                pattern="[0-9]*"
                                value={record.finishTime}
                                onChange={(event) =>
                                    updateRecord(
                                        'finishTime',
                                        formatFinishTime(event.target.value)
                                    )
                                }
                                placeholder="12:13"
                            />
                            {timeError && <FieldError>예: 12:13</FieldError>}
                        </div>

                        <div className="grid gap-3">
                            <Label>캐릭터</Label>
                            <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
                                <CharacterPicker
                                    label="왼쪽"
                                    selectedId={record.leftRunnerId}
                                    onSelect={(characterId) =>
                                        updateRecord(
                                            'leftRunnerId',
                                            characterId
                                        )
                                    }
                                />
                                <CharacterPicker
                                    label="오른쪽"
                                    selectedId={record.rightRunnerId}
                                    onSelect={(characterId) =>
                                        updateRecord(
                                            'rightRunnerId',
                                            characterId
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
                                <RunnerFlipPicker
                                    label="왼쪽 방향"
                                    flipped={record.leftRunnerFlipped}
                                    onChange={(value) =>
                                        updateRecord('leftRunnerFlipped', value)
                                    }
                                />
                                <RunnerFlipPicker
                                    label="오른쪽 방향"
                                    flipped={record.rightRunnerFlipped}
                                    onChange={(value) =>
                                        updateRecord('rightRunnerFlipped', value)
                                    }
                                />
                            </div>
                            <RunnerPositionSlider
                                label="왼쪽 위치"
                                value={record.leftRunnerPosition}
                                onChange={(value) =>
                                    updateRecord('leftRunnerPosition', value)
                                }
                            />
                            <RunnerPositionSlider
                                label="오른쪽 위치"
                                value={record.rightRunnerPosition}
                                onChange={(value) =>
                                    updateRecord('rightRunnerPosition', value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-[1fr_auto] gap-2 max-[420px]:grid-cols-1">
                            <Button
                                type="button"
                                disabled={hasError || isSaving}
                                onClick={handleDownload}
                            >
                                <Download aria-hidden="true" />
                                {isSaving ? '저장 중' : '저장'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={hasError}
                                onClick={() => window.print()}
                            >
                                <Printer aria-hidden="true" />
                                인쇄
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <section
                    className="grid min-w-0 justify-items-center max-[900px]:order-1 print:block"
                    aria-label="기록증 미리보기"
                >
                    <div className={recordCardStyles.frame}>
                        <RecordCardCanvas
                            record={record}
                            widthMm={selectedCardSize.widthMm}
                            heightMm={selectedCardSize.heightMm}
                            outputScale={outputCardScale}
                            offsetX={outputOffsetX}
                            offsetY={outputOffsetY}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default App;
