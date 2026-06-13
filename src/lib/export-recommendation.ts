import { RecommendationResult } from '@/types';

export function downloadRecommendation(result: RecommendationResult) {
  const lines = [
    'TaxWise AI — Product Recommendation',
    '================================',
    '',
    `Recommended product: ${result.recommendedProductName}`,
    `Price: CAD $${result.price}`,
    `Confidence: ${result.confidence}`,
    '',
    'Reasons:',
    ...result.reasons.map((reason) => `- ${reason}`),
    '',
    'Matched answers:',
    result.matchedInputs.join(', ') || 'None',
  ];

  if (result.optionalUpgrade) {
    lines.push(
      '',
      'Optional upgrade:',
      `${result.optionalUpgrade.productName}: ${result.optionalUpgrade.reason}`,
    );
  }

  if (result.warnings?.length) {
    lines.push('', 'Warnings:', ...result.warnings.map((warning) => `- ${warning}`));
  }

  lines.push('', result.disclaimer);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `taxwise-recommendation-${result.recommendedProductId || 'result'}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function printRecommendation(result: RecommendationResult) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=720,height=900');
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>TaxWise Recommendation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; line-height: 1.5; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin-top: 24px; }
    .price { font-size: 28px; font-weight: bold; margin: 12px 0; }
    .muted { color: #475569; font-size: 14px; }
    ul { padding-left: 20px; }
    .disclaimer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 13px; }
  </style>
</head>
<body>
  <h1>Recommended product: ${result.recommendedProductName}</h1>
  <p class="price">CAD $${result.price}</p>
  <p class="muted">Confidence: ${result.confidence}</p>
  <h2>Reasons</h2>
  <ul>${result.reasons.map((reason) => `<li>${reason}</li>`).join('')}</ul>
  <h2>Matched answers</h2>
  <p>${result.matchedInputs.join(', ') || 'None'}</p>
  ${
    result.optionalUpgrade
      ? `<h2>Optional upgrade</h2><p>${result.optionalUpgrade.productName}: ${result.optionalUpgrade.reason}</p>`
      : ''
  }
  ${
    result.warnings?.length
      ? `<h2>Warnings</h2><ul>${result.warnings.map((warning) => `<li>${warning}</li>`).join('')}</ul>`
      : ''
  }
  <p class="disclaimer">${result.disclaimer}</p>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
