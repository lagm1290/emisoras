export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  const s = 60 + Math.abs(hash % 20);
  const l = 35 + Math.abs(hash % 15);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function stringToGradient(str) {
  const c1 = stringToColor(str);
  const c2 = stringToColor(str + '2');
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}
