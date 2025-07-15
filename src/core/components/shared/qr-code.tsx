import { useQRCode } from 'next-qrcode';

interface QRCodeProps {
  data: string;
  size?: number;
  margin?: number;
  colors?: { dark: string; light: string };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

export default function QRCode({
  data,
  size = 200,
  margin = 4,
  colors = { dark: '#000', light: '#FFf' },
  errorCorrectionLevel = 'Q',
  className,
}: QRCodeProps) {
  const { SVG } = useQRCode();

  const encodedData = encodeURI(data);

  return (
    <div className={`overflow-hidden ${className}`}>
      <SVG
        text={encodedData}
        options={{
          margin,
          width: size,
          errorCorrectionLevel,
          color: colors,
        }}
      />
    </div>
  );
}
