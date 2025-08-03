#!/usr/bin/env node

// Script to replace string literals with enum values across the codebase
const fs = require('fs');
const path = require('path');

const enumMappings = {
  // Order Status
  '"PENDING"': 'OrderStatus.PENDING',
  "'PENDING'": 'OrderStatus.PENDING',
  '"PENDING_SLIP"': 'OrderStatus.PENDING_SLIP',
  "'PENDING_SLIP'": 'OrderStatus.PENDING_SLIP',
  '"PAID"': 'OrderStatus.PAID',
  "'PAID'": 'OrderStatus.PAID',
  '"CONFIRMED"': 'OrderStatus.CONFIRMED',
  "'CONFIRMED'": 'OrderStatus.CONFIRMED',
  '"CANCELLED"': 'OrderStatus.CANCELLED',
  "'CANCELLED'": 'OrderStatus.CANCELLED',
  '"EXPIRED"': 'OrderStatus.EXPIRED',
  "'EXPIRED'": 'OrderStatus.EXPIRED',
  '"BOOKED"': 'OrderStatus.BOOKED',
  "'BOOKED'": 'OrderStatus.BOOKED',
  '"REFUNDED"': 'OrderStatus.REFUNDED',
  "'REFUNDED'": 'OrderStatus.REFUNDED',
  '"NO_SHOW"': 'OrderStatus.NO_SHOW',
  "'NO_SHOW'": 'OrderStatus.NO_SHOW',

  // Payment Method
  '"QR_CODE"': 'PaymentMethod.QR_CODE',
  "'QR_CODE'": 'PaymentMethod.QR_CODE',
  '"CASH"': 'PaymentMethod.CASH',
  "'CASH'": 'PaymentMethod.CASH',
  '"BANK_TRANSFER"': 'PaymentMethod.BANK_TRANSFER',
  "'BANK_TRANSFER'": 'PaymentMethod.BANK_TRANSFER',
  '"CREDIT_CARD"': 'PaymentMethod.CREDIT_CARD',
  "'CREDIT_CARD'": 'PaymentMethod.CREDIT_CARD',

  // Ticket Type
  '"RINGSIDE"': 'TicketType.RINGSIDE',
  "'RINGSIDE'": 'TicketType.RINGSIDE',
  '"STADIUM"': 'TicketType.STADIUM',
  "'STADIUM'": 'TicketType.STADIUM',
  '"STANDING"': 'TicketType.STANDING',
  "'STANDING'": 'TicketType.STANDING',

  // Order Purchase Type
  '"WEBSITE"': 'OrderPurchaseType.WEBSITE',
  "'WEBSITE'": 'OrderPurchaseType.WEBSITE',
  '"BOOKING"': 'OrderPurchaseType.BOOKING',
  "'BOOKING'": 'OrderPurchaseType.BOOKING',
  '"ONSITE"': 'OrderPurchaseType.ONSITE',
  "'ONSITE'": 'OrderPurchaseType.ONSITE',

  // Payment Status
  '"PROCESSING"': 'PaymentStatus.PROCESSING',
  "'PROCESSING'": 'PaymentStatus.PROCESSING',
  '"FAILED"': 'PaymentStatus.FAILED',
  "'FAILED'": 'PaymentStatus.FAILED',

  // Seat Status
  '"AVAILABLE"': 'SeatStatus.AVAILABLE',
  "'AVAILABLE'": 'SeatStatus.AVAILABLE',
  '"RESERVED"': 'SeatStatus.RESERVED',
  "'RESERVED'": 'SeatStatus.RESERVED',
  '"OCCUPIED"': 'SeatStatus.OCCUPIED',
  "'OCCUPIED'": 'SeatStatus.OCCUPIED',
  '"BLOCKED"': 'SeatStatus.BLOCKED',
  "'BLOCKED'": 'SeatStatus.BLOCKED',
  '"EMPTY"': 'SeatStatus.EMPTY',
  "'EMPTY'": 'SeatStatus.EMPTY',

  // Standing Ticket Type
  '"ADULT"': 'StandingTicketType.ADULT',
  "'ADULT'": 'StandingTicketType.ADULT',
  '"CHILD"': 'StandingTicketType.CHILD',
  "'CHILD'": 'StandingTicketType.CHILD',

  // User Role
  '"user"': 'UserRole.USER',
  "'user'": 'UserRole.USER',
  '"staff"': 'UserRole.STAFF',
  "'staff'": 'UserRole.STAFF',
  '"manager"': 'UserRole.MANAGER',
  "'manager'": 'UserRole.MANAGER',
  '"admin"': 'UserRole.ADMIN',
  "'admin'": 'UserRole.ADMIN',
  '"system"': 'UserRole.SYSTEM',
  "'system'": 'UserRole.SYSTEM',

  // Order Source
  '"DIRECT"': 'OrderSource.DIRECT',
  "'DIRECT'": 'OrderSource.DIRECT',
  '"KKDAY"': 'OrderSource.KKDAY',
  "'KKDAY'": 'OrderSource.KKDAY',
  '"SAYAMA"': 'OrderSource.SAYAMA',
  "'SAYAMA'": 'OrderSource.SAYAMA',
  '"ASIA_THAILAND"': 'OrderSource.ASIA_THAILAND',
  "'ASIA_THAILAND'": 'OrderSource.ASIA_THAILAND',
  '"OTHER"': 'OrderSource.OTHER',
  "'OTHER'": 'OrderSource.OTHER',

  // Attendance Status
  '"CHECKED_IN"': 'AttendanceStatus.CHECKED_IN',
  "'CHECKED_IN'": 'AttendanceStatus.CHECKED_IN',
};

const requiredImports = {
  'OrderStatus': 'OrderStatus',
  'PaymentMethod': 'PaymentMethod',
  'TicketType': 'TicketType',
  'OrderPurchaseType': 'OrderPurchaseType',
  'PaymentStatus': 'PaymentStatus',
  'SeatStatus': 'SeatStatus',
  'StandingTicketType': 'StandingTicketType',
  'UserRole': 'UserRole',
  'OrderSource': 'OrderSource',
  'AttendanceStatus': 'AttendanceStatus',
};

function processFile(filePath) {
  if (!filePath.endsWith('.vue') && !filePath.endsWith('.ts') && !filePath.endsWith('.js')) {
    return;
  }

  // Skip node_modules and .git directories
  if (filePath.includes('node_modules') || filePath.includes('.git')) {
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const usedEnums = new Set();

    // Replace string literals with enum values
    for (const [literal, enumValue] of Object.entries(enumMappings)) {
      // Only replace if it's in a comparison context (=== or !==)
      const patterns = [
        new RegExp(`===\\s*${literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        new RegExp(`!==\\s*${literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        new RegExp(`==\\s*${literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        new RegExp(`!=\\s*${literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
      ];

      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => {
            const operator = match.replace(literal, '').trim();
            const enumName = enumValue.split('.')[0];
            usedEnums.add(enumName);
            hasChanges = true;
            return `${operator} ${enumValue}`;
          });
        }
      });
    }

    // Add imports if enums are used and not already imported
    if (usedEnums.size > 0) {
      const enumsToImport = Array.from(usedEnums);
      const importStatement = `import { ${enumsToImport.join(', ')} } from "@/types/Enums";`;
      
      // Check if import already exists
      if (!content.includes('from "@/types/Enums"') && !content.includes("from '@/types/Enums'")) {
        // Find the best place to add the import
        const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
        const matches = content.match(importRegex);
        
        if (matches && matches.length > 0) {
          // Add after last import
          const lastImport = matches[matches.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          const insertIndex = lastImportIndex + lastImport.length;
          content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex);
          hasChanges = true;
        } else if (content.includes('<script setup')) {
          // Add after script setup tag
          const scriptIndex = content.indexOf('<script setup');
          const scriptEndIndex = content.indexOf('>', scriptIndex) + 1;
          content = content.slice(0, scriptEndIndex) + '\n' + importStatement + content.slice(scriptEndIndex);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

// Start processing from current directory
const targetDirs = ['pages', 'components', 'composables', 'utils', 'stores'];

console.log('Starting enum replacement...');
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Processing ${dir}/...`);
    processDirectory(dir);
  }
});
console.log('Enum replacement completed!');
