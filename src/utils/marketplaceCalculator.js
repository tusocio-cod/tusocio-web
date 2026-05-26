export const marketplaceFeeConfig = {
  shopee: {
    label: "Shopee",
    active: true,
    commissionPercent: 12,
    servicePercent: 2,
    transactionPercent: 2,
    fixedFee: 3,
    shippingFeePercent: 0,
    extraFeePercent: 1.65,
    minimumFee: 0,
    maximumFee: null,
    lastUpdated: "15/05/2024",
    source: "Política de Comisión para vendedores CNPJ e CPF para 2026",
    notes: "Las tasas pueden variar si participas en acciones comerciales. El valor varía en función del precio final de venta."
  },
  shein: {
    label: "SHEIN",
    active: true,
    commissionPercent: 20,
    servicePercent: 0,
    transactionPercent: 0,
    fixedFee: 5,
    shippingFeePercent: 0,
    extraFeePercent: 0,
    minimumFee: 0,
    maximumFee: null,
    lastUpdated: "26/05/2026",
    source: "Central de Ajuda SHEIN",
    notes: "Comisión de 20% + R$ 5,00 fijos por Intermediação de frete."
  },
  tiktokshop: {
    label: "TikTok Shop",
    active: true,
    commissionPercent: 6,
    servicePercent: 0,
    transactionPercent: 0,
    fixedFee: 4,
    shippingFeePercent: 0,
    extraFeePercent: 0,
    minimumFee: 0,
    maximumFee: null,
    lastUpdated: "13/04/2026",
    source: "Tarifa de Comissão da Plataforma 13/04/2026",
    notes: "Comisión 6% + R$ 4 fijos por item. Nuevos vendedores pueden solicitar 0% de comisión por 60 días."
  },
  mercadolivre: {
    label: "Mercado Livre",
    active: true,
    commissionPercent: 10,
    servicePercent: 0,
    transactionPercent: 0,
    fixedFee: 6,
    shippingFeePercent: 0,
    extraFeePercent: 0,
    minimumFee: 0,
    maximumFee: null,
    lastUpdated: "",
    source: "Pendiente de validación por Tu Socio",
    notes: "Actualizar con la regla real validada por el equipo."
  }
};

export function calculateMarketplaceFees({
  platformId,
  mode, // 'calculateNet' | 'calculateSuggestedPrice'
  mainValue, // grossPrice (mode 1) or desiredNetValue (mode 2)
  productCost = 0,
  shippingCost = 0,
  otherCosts = 0,
  sellerType = 'CNPJ', // 'CNPJ' or 'CPF'
  hasSFP = false, // TikTok Shop Shipping Fee Program
  affiliateCommission = 0 // TikTok Shop Affiliate %
}) {
  const config = marketplaceFeeConfig[platformId];
  if (!config) throw new Error("Platform not found");

  const pCost = Number(productCost) || 0;
  const sCost = Number(shippingCost) || 0;
  const oCost = Number(otherCosts) || 0;
  const totalUserCosts = pCost + sCost + oCost;

  let grossPrice = 0;
  let desiredNetValue = 0;
  let totalPercentFees = 0;
  let totalFixedFees = 0;
  let totalPlatformFees = 0;
  let estimatedNetValue = 0;
  let estimatedProfit = 0;
  let suggestedPrice = 0;

  // Determine service percent override
  let currentServicePercent = config.servicePercent || 0;
  let currentExtraPercent = config.extraFeePercent || 0;
  if (platformId === 'tiktokshop') {
    if (hasSFP) currentServicePercent = 6;
    currentExtraPercent = Number(affiliateCommission) || 0;
  }

  // Helper function to get Shopee dynamic fees based on gross price
  const getShopeeFees = (price) => {
    let pct = 0;
    let fixed = 0;
    if (price <= 79.99) {
      pct = 20;
      fixed = 4;
    } else if (price <= 99.99) {
      pct = 14;
      fixed = 16;
    } else if (price <= 199.99) {
      pct = 14;
      fixed = 20;
    } else {
      pct = 14;
      fixed = 26;
    }
    if (sellerType === 'CPF') fixed += 3;
    return { pct, fixed };
  };

  if (mode === 'calculateNet') {
    grossPrice = Number(mainValue) || 0;
    
    if (platformId === 'shopee') {
      const { pct, fixed } = getShopeeFees(grossPrice);
      totalPercentFees = pct;
      totalFixedFees = fixed;
    } else {
      totalPercentFees = (config.commissionPercent || 0) + currentServicePercent + (config.transactionPercent || 0) + (config.shippingFeePercent || 0) + currentExtraPercent;
      totalFixedFees = config.fixedFee || 0;
    }

    const calculatedPercentFee = grossPrice * (totalPercentFees / 100);
    totalPlatformFees = calculatedPercentFee + totalFixedFees;
    
    if (config.minimumFee && totalPlatformFees < config.minimumFee) totalPlatformFees = config.minimumFee;
    if (config.maximumFee && totalPlatformFees > config.maximumFee) totalPlatformFees = config.maximumFee;

    estimatedNetValue = grossPrice - totalPlatformFees - sCost;
    estimatedProfit = estimatedNetValue - pCost - oCost;

  } else if (mode === 'calculateSuggestedPrice') {
    desiredNetValue = Number(mainValue) || 0;
    
    if (platformId === 'shopee') {
      // Find which bracket works backwards
      const brackets = [
        { min: 0, max: 79.99, pct: 20, fixed: 4 + (sellerType === 'CPF' ? 3 : 0) },
        { min: 80, max: 99.99, pct: 14, fixed: 16 + (sellerType === 'CPF' ? 3 : 0) },
        { min: 100, max: 199.99, pct: 14, fixed: 20 + (sellerType === 'CPF' ? 3 : 0) },
        { min: 200, max: Infinity, pct: 14, fixed: 26 + (sellerType === 'CPF' ? 3 : 0) }
      ];

      for (const bracket of brackets) {
        const numerator = desiredNetValue + totalUserCosts + bracket.fixed;
        const denominator = 1 - (bracket.pct / 100);
        const testPrice = denominator > 0 ? numerator / denominator : 0;
        
        // Due to floating point issues, we check with a slight tolerance or round to 2 decimals
        const roundedPrice = Math.round(testPrice * 100) / 100;
        if (roundedPrice >= bracket.min && roundedPrice <= bracket.max) {
          suggestedPrice = testPrice;
          totalPercentFees = bracket.pct;
          totalFixedFees = bracket.fixed;
          break;
        }
      }
      
      // Fallback if no bracket matched perfectly (rare edge case on boundaries)
      if (suggestedPrice === 0) {
        suggestedPrice = desiredNetValue + totalUserCosts;
        totalPercentFees = 14; 
        totalFixedFees = 26 + (sellerType === 'CPF' ? 3 : 0);
      }
      grossPrice = suggestedPrice;
      totalPlatformFees = (grossPrice * (totalPercentFees / 100)) + totalFixedFees;

    } else {
      totalPercentFees = (config.commissionPercent || 0) + currentServicePercent + (config.transactionPercent || 0) + (config.shippingFeePercent || 0) + currentExtraPercent;
      totalFixedFees = config.fixedFee || 0;
      
      const numerator = desiredNetValue + totalUserCosts + totalFixedFees;
      const denominator = 1 - (totalPercentFees / 100);
      suggestedPrice = denominator > 0 ? numerator / denominator : 0;
      grossPrice = suggestedPrice;
      totalPlatformFees = (grossPrice * (totalPercentFees / 100)) + totalFixedFees;
    }
    
    estimatedNetValue = grossPrice - totalPlatformFees - sCost;
    estimatedProfit = estimatedNetValue - pCost - oCost;
  }

  // Breakdown handling for display
  let breakdown = {
    commission: platformId === 'shopee' ? (totalPercentFees - 2) : config.commissionPercent || 0,
    service: platformId === 'shopee' ? 0 : currentServicePercent,
    transaction: platformId === 'shopee' ? 2 : config.transactionPercent || 0,
    fixed: totalFixedFees,
    extra: platformId === 'shopee' ? 0 : currentExtraPercent
  };

  return {
    grossPrice,
    desiredNetValue,
    totalPercentFees,
    totalFixedFees,
    totalPlatformFees,
    totalUserCosts,
    estimatedNetValue,
    estimatedProfit,
    suggestedPrice,
    breakdown,
    config
  };
}
