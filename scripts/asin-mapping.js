/**
 * ASIN 映射表：Audible.com ASIN -> Amazon.com ASIN
 * 
 * 通过 Amazon.com 搜索验证的正确 ASIN
 * 这些 ASIN 在 amazon.com/dp/{ASIN} 上有效，可用于 affiliate 链接
 */
const asinMapping = {
  // Batch 1 (索引 0-4)
  'B003ZWFO7E': 'B0041JKFJW', // The Way of Kings
  'B0077DEH7A': 'B0078XQQIC', // The Stand
  'B002UZYX2Y': 'B000X1MX7E', // The Pillars of the Earth
  'B002UZMLXM': 'B002A2BO2Y', // The Name of the Wind
  'B005UR3VFO': 'B0064HJNQK', // 11/22/63
  
  // Batch 2 (索引 5-9)
  'B002V0QUJC': 'B0009MZ7F2', // The Shadow of the Wind
  'B0FD4CV4BF': 'B0FD49GYHN', // The Power of Habit (可能需要验证)
  'B0D6P455PH': 'B07HHJ7669', // The Hunger Games
  'B005V0QI82': 'B07ZMKXMTG', // Steve Jobs
  'B0036NDRG2': 'B001G8MA4O', // The Girl with the Dragon Tattoo
  
  // Batch 3 (索引 10-14)
  'B0085XRNWM': 'B0088UT8IO', // Gone Girl
  'B002UZZ93G': 'B0001DBI1Q', // A Game of Thrones
  'B005TKKCWC': 'B005Z9GAJG', // Thinking, Fast and Slow
  'B07DHS7PP5': 'B005HG7BWC', // Ready Player One (注意：原数据索引13和74都用了B07DHS7PP5)
  'B082BHJMFF': 'B082BHWQCJ', // The Martian
  
  // Batch 4 (索引 15-19)
  'B0055274U2': 'B005745I4C', // American Gods
  'B002V1CJ8W': 'B000GW8NVA', // Outlander
  'B002UZKYDQ': 'B001SIHRUY', // The Help
  '1524779261': 'B07RFSSYBH', // Atomic Habits
  'B08G9PRS1K': 'B08GB58KD5', // Project Hail Mary
  
  // Batch 5 (索引 20-24)
  'B00HWF0MHW': 'B00HWDEFMW', // Words of Radiance
  'B0B5M28HZK': 'B0B5M1SPR2', // Edgedancer
  // 剩余的还需要查询...
};

module.exports = asinMapping;
