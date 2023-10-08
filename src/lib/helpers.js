export function hexToRgba(hex, alpha) {
    // Ensure the alpha is between 0 and 1
    alpha = Math.min(1, Math.max(0, alpha));
    
    // Ensure the hex string has the right format
    if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
    }
    
    // Check the length of the hex string
    if (hex.length !== 6 && hex.length !== 8) {
        console.error('Invalid hex color string');
        return null;
    }
    
    // Extract the red, green, blue components from the hex string
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // If the hex string contains alpha, extract it, else default alpha to 1
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
    
    // Combine the components and the input alpha into an rgba string
    return `rgba(${r}, ${g}, ${b}, ${alpha * a})`;
}