import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Breakpoint, PreviewPaneProps, Layout } from './types';

const breakpointSizes: Record<Breakpoint, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

function renderLayoutToHtml(layout: Layout): string {
  // Convert layout components to HTML
  return layout.components.map(component => {
    const styles = {
      ...component.styles.layout,
      ...component.styles.typography,
      ...component.styles.colors,
      ...component.styles.effects,
    };

    return `
      <div style="${Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';')}">
        ${component.type.name}
      </div>
    `;
  }).join('\n');
}

export function PreviewPane({
  layout,
  breakpoint,
  scale = 1,
  onResize,
}: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zoom, setZoom] = useState(scale);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Create a stringified version of the layout for preview
      const previewHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .preview-container {
                width: 100%;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
              }
            </style>
          </head>
          <body>
            <div class="preview-container">
              ${renderLayoutToHtml(layout)}
            </div>
          </body>
        </html>
      `;

      iframeRef.current.contentWindow.document.open();
      iframeRef.current.contentWindow.document.write(previewHtml);
      iframeRef.current.contentWindow.document.close();
    }
  }, [layout]);

  const handleZoomChange = (value: number[]) => {
    const newZoom = value[0];
    setZoom(newZoom);
    onResize?.(breakpointSizes[breakpoint] * newZoom, window.innerHeight * newZoom);
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Select value={breakpoint} onValueChange={(value: Breakpoint) => onResize?.(breakpointSizes[value], window.innerHeight)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select breakpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
          <Slider
            value={[zoom]}
            min={0.25}
            max={2}
            step={0.25}
            className="w-32"
            onValueChange={handleZoomChange}
          />
        </div>
      </div>

      <div className="relative flex-1 overflow-auto bg-gray-100 p-4">
        <div
          className="relative mx-auto"
          style={{
            width: breakpointSizes[breakpoint],
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            ref={iframeRef}
            title="Page Preview"
            className="w-full bg-white shadow-lg"
            style={{
              height: '100vh',
              border: '1px solid #e5e7eb',
            }}
          />
        </div>
      </div>
    </Card>
  );
}