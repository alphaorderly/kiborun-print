import { Download, Printer } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

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

const runnerCharacterById = Object.fromEntries(
    runnerCharacters.map((character) => [character.id, character])
) as Record<RunnerCharacterId, (typeof runnerCharacters)[number]>;

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

type TextOffsetStyle = CSSProperties & {
    '--text-y-offset': string;
};

type CardSizeStyle = CSSProperties & {
    '--card-output-width': string;
    '--card-output-height': string;
    '--card-output-offset-x': string;
    '--card-output-offset-y': string;
    '--card-output-scale': string;
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

const zeroTextVerticalOffsets: TextVerticalOffsets = {
    label: 0,
    bib: 0,
    name: 0,
    course: 0.4,
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
        course: 0.3,
        time: -0.06,
    },
    'gmarket-sans': {
        label: 0.12,
        bib: 0.7,
        name: 0.18,
        course: 0.6,
        time: 0.8,
    },
    suit: {
        label: 0.02,
        bib: 0.06,
        name: 0.04,
        course: 0.2,
        time: -0.0,
    },
    'line-seed': {
        label: 0.1,
        bib: 0.7,
        name: 0.4,
        course: 0.7,
        time: 0.8,
    },
    'noto-sans-kr': {
        label: 0,
        bib: -0.1,
        name: -0.6,
        course: 0,
        time: -0.9,
    },
};

const getTextVerticalOffset = (
    fontFamilyId: FontFamilyId,
    slot: TextSlotId
) => {
    const offset = verticalOffsetByFont[fontFamilyId][slot];

    return `${Number(offset.toFixed(3))}mm`;
};

const recordCardStyles = {
    frame: 'relative h-[calc(var(--card-output-height)*var(--card-preview-scale))] w-[calc(var(--card-output-width)*var(--card-preview-scale))] overflow-hidden [--card-preview-scale:1] [filter:drop-shadow(0_24px_48px_rgb(15_23_42_/_22%))] max-[360px]:[--card-preview-scale:0.82] min-[680px]:[--card-preview-scale:1.45] min-[1050px]:[--card-preview-scale:1.82] print:block print:h-[var(--card-output-height)] print:w-[var(--card-output-width)] print:[--card-preview-scale:1] print:filter-none',
    card: 'record-card-type absolute top-[calc(var(--card-output-offset-y)*var(--card-preview-scale))] left-[calc(var(--card-output-offset-x)*var(--card-preview-scale))] isolate h-[85.6mm] w-[54mm] origin-top-left overflow-hidden rounded-[3mm] bg-sky-200 text-[#45373a] [print-color-adjust:exact] [transform:scale(calc(var(--card-preview-scale)*var(--card-output-scale)))] [-webkit-print-color-adjust:exact] print:rounded-none',
    bg: 'absolute inset-0 z-[-3] h-full w-full object-cover [object-position:49%_top]',
    glow: 'absolute inset-0 z-[-2] bg-[linear-gradient(180deg,rgb(99_207_255_/_30%)_0%,rgb(255_255_255_/_8%)_42%,rgb(255_236_159_/_20%)_100%),radial-gradient(circle_at_50%_11%,rgb(255_255_255_/_80%),transparent_16%),radial-gradient(circle_at_78%_35%,rgb(255_255_255_/_45%),transparent_24%)]',
    border: 'pointer-events-none absolute inset-[1.2mm] z-8 rounded-[2.55mm] border-[0.45mm] border-white/70 shadow-[inset_0_0_0_0.18mm_rgb(61_91_106_/_18%),inset_0_-8mm_16mm_rgb(22_92_130_/_13%)]',
    header: 'relative z-2 grid gap-[2.2mm] px-[5.7mm] pt-[7mm]',
    logo: 'h-auto w-[36mm]',
    title: 'soft-title-outline m-0 text-[6.1mm] leading-[0.95] font-black tracking-[0.01em] text-[#3c3838]',
    panel: 'absolute top-[31.4mm] left-[5.2mm] z-4 w-[43.6mm] overflow-hidden rounded-[2.2mm] border-[0.35mm] border-[rgb(255_218_95_/_95%)] bg-white/92 text-center shadow-[0_1.7mm_4mm_rgb(37_89_116_/_18%),inset_0_0_0_0.2mm_rgb(255_255_255_/_76%)] backdrop-blur-[1.5mm]',
    label: 'soft-label-type flex h-[4.6mm] items-center justify-center bg-[linear-gradient(180deg,#fff08d,#ffd85a)] text-[2.45mm] leading-none font-bold tracking-[0.08em] text-[#4d3a3e]',
    bib: 'soft-ink flex h-[6.6mm] items-center justify-center text-[4.35mm] leading-none font-bold tracking-[0.1em] text-[#4a373a]',
    name: 'soft-ink-strong flex h-[12.7mm] min-w-0 items-center justify-center border-t-[0.25mm] border-t-[rgb(255_218_95_/_72%)] px-[1.5mm] leading-none font-extrabold tracking-[0.02em] text-[#4b3a3d]',
    course: 'soft-label-type flex h-[5mm] items-center justify-center bg-[linear-gradient(180deg,#fff08d,#ffd85a)] text-[3.15mm] leading-none font-bold tracking-[0.04em] text-[#4d3a3e]',
    time: 'soft-number-type flex h-[13.5mm] items-center justify-center whitespace-nowrap text-[8.9mm] leading-none font-extrabold tracking-[-0.02em] text-[#45373a] [font-variant-numeric:tabular-nums]',
    runner: 'pointer-events-none absolute z-5 h-[18.5mm] w-auto object-contain [filter:drop-shadow(0_0.6mm_0.5mm_rgb(60_45_48_/_20%))]',
    runnerLeft: 'bottom-[3mm]',
    runnerRight: 'bottom-[3mm] scale-x-[-1]',
    track: 'absolute right-[2.8mm] bottom-[2.3mm] left-[2.8mm] z-3 h-[8.6mm] rounded-t-full bg-[linear-gradient(105deg,transparent_0_17%,rgb(255_219_108_/_78%)_17%_18%,transparent_18%_42%,rgb(255_219_108_/_68%)_42%_43%,transparent_43%),linear-gradient(180deg,rgb(129_186_207_/_66%),rgb(82_150_181_/_48%))] opacity-[0.68]',
} as const;

const textStyleClassMap: Record<
    TextStyleId,
    {
        panel: string;
        label: string;
        bib: string;
        name: string;
        course: string;
        time: string;
    }
> = {
    balanced: {
        panel: '',
        label: '',
        bib: '',
        name: '',
        course: '',
        time: '',
    },
    sport: {
        panel: '',
        label: 'text-[#51363a] tracking-[0.1em]',
        bib: 'font-extrabold tracking-[0.13em]',
        name: 'font-black tracking-[0.01em]',
        course: 'font-extrabold text-[#51363a]',
        time: 'font-black tracking-[-0.04em] text-[#3f3236]',
    },
    round: {
        panel: '',
        label: 'text-[#5b4a52] tracking-[0.04em]',
        bib: 'text-[#5a4a51] tracking-[0.08em]',
        name: 'font-bold tracking-[0.01em] text-[#59464d]',
        course: 'text-[#5b4a52]',
        time: 'font-bold tracking-[-0.01em] text-[#554249]',
    },
    arcade: {
        panel: '',
        label: 'text-[#322b3a] tracking-[0.13em]',
        bib: 'font-black tracking-[0.16em] text-[#352b38]',
        name: 'soft-arcade-outline font-black tracking-[0.03em] text-[#342b38]',
        course: 'text-[#322b3a] tracking-[0.08em]',
        time: 'soft-arcade-outline font-black tracking-[-0.03em] text-[#302a3a]',
    },
};

const headerAlignmentClassMap: Record<
    HeaderAlignmentId,
    {
        item: string;
        title: string;
    }
> = {
    left: {
        item: 'justify-self-start',
        title: 'text-left',
    },
    center: {
        item: 'justify-self-center',
        title: 'text-center',
    },
    right: {
        item: 'justify-self-end',
        title: 'text-right',
    },
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

const AlignedText = ({
    children,
    className,
    fontFamilyId,
    slot,
}: {
    children: ReactNode;
    className?: string;
    fontFamilyId: FontFamilyId;
    slot: TextSlotId;
}) => (
    <span
        className="inline-block [transform:translateY(var(--text-y-offset))]"
        style={
            {
                '--text-y-offset': getTextVerticalOffset(fontFamilyId, slot),
            } as TextOffsetStyle
        }
    >
        <span className={className}>{children}</span>
    </span>
);

const NAME_BASE_FONT_SIZE_MM = 5.6;
const NAME_MIN_FONT_SIZE_MM = 1.8;
const NAME_FONT_SIZE_STEP_MM = 0.05;
const NAME_FIT_PADDING_PX = 1;

const AutoFitName = ({
    text,
    fontFamilyId,
    textStyleId,
}: {
    text: string;
    fontFamilyId: FontFamilyId;
    textStyleId: TextStyleId;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [fontSizeMm, setFontSizeMm] = useState(NAME_BASE_FONT_SIZE_MM);

    useLayoutEffect(() => {
        const fitText = () => {
            const container = containerRef.current;
            const textElement = textRef.current;

            if (!container || !textElement) {
                return;
            }

            const maxWidth =
                container.getBoundingClientRect().width - NAME_FIT_PADDING_PX;

            if (maxWidth <= 0) {
                return;
            }

            let nextSize = NAME_BASE_FONT_SIZE_MM;
            textElement.style.fontSize = `${nextSize}mm`;

            const textWidth = textElement.getBoundingClientRect().width;

            if (textWidth > maxWidth) {
                nextSize = Math.max(
                    NAME_MIN_FONT_SIZE_MM,
                    (NAME_BASE_FONT_SIZE_MM * maxWidth) / textWidth
                );
                textElement.style.fontSize = `${nextSize}mm`;
            }

            while (
                textElement.getBoundingClientRect().width > maxWidth &&
                nextSize > NAME_MIN_FONT_SIZE_MM
            ) {
                nextSize = Math.max(
                    NAME_MIN_FONT_SIZE_MM,
                    nextSize - NAME_FONT_SIZE_STEP_MM
                );
                textElement.style.fontSize = `${nextSize}mm`;
            }

            setFontSizeMm(nextSize);
        };

        fitText();

        const container = containerRef.current;

        if (!container) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            fitText();
        });
        resizeObserver.observe(container);

        void document.fonts.ready.then(fitText);

        return () => {
            resizeObserver.disconnect();
        };
    }, [text, fontFamilyId, textStyleId]);

    return (
        <div
            ref={containerRef}
            className="w-full min-w-0 overflow-hidden text-center"
        >
            <AlignedText fontFamilyId={fontFamilyId} slot="name">
                <span
                    ref={textRef}
                    className="inline-block whitespace-nowrap"
                    style={{ fontSize: `${fontSizeMm}mm` }}
                >
                    <span className="typo-badge typo-badge-name">{text}</span>
                </span>
            </AlignedText>
        </div>
    );
};

const RecordCard = ({ record }: { record: RecordInput }) => {
    const leftRunner = runnerCharacterById[record.leftRunnerId];
    const rightRunner = runnerCharacterById[record.rightRunnerId];
    const fontOption = fontOptionById[record.fontFamilyId];
    const textStyle = textStyleClassMap[record.textStyleId];
    const logoAlignment = headerAlignmentClassMap[record.logoAlignmentId];
    const titleAlignment = headerAlignmentClassMap[record.titleAlignmentId];

    return (
        <div
            className={recordCardStyles.card}
            style={{ fontFamily: fontOption.fontFamily }}
            role="img"
            aria-label="완주 기록증"
        >
            <img
                className={recordCardStyles.bg}
                src={bgImage}
                alt=""
                aria-hidden="true"
            />
            <div className={recordCardStyles.glow} aria-hidden="true" />
            <div className={recordCardStyles.border} aria-hidden="true" />

            <header className={recordCardStyles.header}>
                <img
                    className={cn(recordCardStyles.logo, logoAlignment.item)}
                    src={logoImage}
                    alt="Kivotos Run"
                />
                <h2
                    className={cn(
                        recordCardStyles.title,
                        titleAlignment.item,
                        titleAlignment.title
                    )}
                >
                    완주 기록증
                </h2>
            </header>

            <section className={cn(recordCardStyles.panel, textStyle.panel)}>
                <div className={cn(recordCardStyles.label, textStyle.label)}>
                    <AlignedText
                        fontFamilyId={record.fontFamilyId}
                        slot="label"
                    >
                        번호
                    </AlignedText>
                </div>
                <div className={cn(recordCardStyles.bib, textStyle.bib)}>
                    <div className="flex items-center justify-center gap-[1.2mm]">
                        <AlignedText
                            className="typo-badge typo-badge-subtle"
                            fontFamilyId={record.fontFamilyId}
                            slot="bib"
                        >
                            {record.bibGroup}
                            {record.bibNumber || '0000'}
                        </AlignedText>
                    </div>
                </div>
                <div className={cn(recordCardStyles.name, textStyle.name)}>
                    <AutoFitName
                        text={record.runnerName || '이름'}
                        fontFamilyId={record.fontFamilyId}
                        textStyleId={record.textStyleId}
                    />
                </div>
                <div className={cn(recordCardStyles.course, textStyle.course)}>
                    <AlignedText
                        fontFamilyId={record.fontFamilyId}
                        slot="course"
                    >
                        5km
                    </AlignedText>
                </div>
                <div className={cn(recordCardStyles.time, textStyle.time)}>
                    <AlignedText
                        className="typo-badge typo-badge-time"
                        fontFamilyId={record.fontFamilyId}
                        slot="time"
                    >
                        {record.finishTime || '00:00'}
                    </AlignedText>
                </div>
            </section>

            <img
                className={cn(
                    recordCardStyles.runner,
                    recordCardStyles.runnerLeft
                )}
                src={leftRunner.image}
                style={{ left: `${record.leftRunnerPosition}mm` }}
                alt=""
                aria-hidden="true"
            />
            <img
                className={cn(
                    recordCardStyles.runner,
                    recordCardStyles.runnerRight
                )}
                src={rightRunner.image}
                style={{ right: `${record.rightRunnerPosition}mm` }}
                alt=""
                aria-hidden="true"
            />
            <div className={recordCardStyles.track} aria-hidden="true" />
        </div>
    );
};

const App = () => {
    const [record, setRecord] = useState<RecordInput>(initialRecord);
    const [isSaving, setIsSaving] = useState(false);
    const cardFrameRef = useRef<HTMLDivElement>(null);
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
        const cardFrame = cardFrameRef.current;

        if (!cardFrame || hasError) {
            return;
        }

        setIsSaving(true);

        const previousPreviewScale = cardFrame.style.getPropertyValue(
            '--card-preview-scale'
        );
        const previousFilter = cardFrame.style.filter;

        try {
            await document.fonts.ready;

            cardFrame.dataset.cardExporting = 'true';
            cardFrame.style.setProperty('--card-preview-scale', '1');
            cardFrame.style.filter = 'none';
            void cardFrame.offsetWidth;

            const dataUrl = await toPng(cardFrame, {
                backgroundColor: '#ffffff',
                cacheBust: true,
                height: mmToCssPx(selectedCardSize.heightMm),
                pixelRatio: 3.125,
                width: mmToCssPx(selectedCardSize.widthMm),
            });

            const link = document.createElement('a');
            link.download = `kivotos-run-${record.bibNumber}-${sanitizeFileName(record.runnerName)}-${selectedCardSize.widthMm}x${selectedCardSize.heightMm}mm.png`;
            link.href = dataUrl;
            link.click();
        } finally {
            if (previousPreviewScale) {
                cardFrame.style.setProperty(
                    '--card-preview-scale',
                    previousPreviewScale
                );
            } else {
                cardFrame.style.removeProperty('--card-preview-scale');
            }

            cardFrame.style.filter = previousFilter;
            delete cardFrame.dataset.cardExporting;
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
                    <div ref={cardFrameRef} className={recordCardStyles.frame}>
                        <RecordCard record={record} />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default App;
