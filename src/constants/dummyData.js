export const INITIAL_CLIENTS = [];
export const INITIAL_INVOICES = [];
export const INITIAL_QUOTATIONS = [];
export const DEFAULT_SETTINGS = {
    general: {
        yearStart: '',
        yearEnd: '',
        predefinedLineItems: ''
    },
    business: {
        logoUrl: '',
        name: '',
        address: '',
        extraInfo: '',
        website: '',
        letterheadEnabled: false,
        letterheadUrl: '',
        letterheadLogoPosition: 'left',
        letterheadShowAddress: true
    },
    invoice: {
        prefix: 'INV-',
        suffix: '',
        autoIncrement: true,
        nextNumber: '0001',
        defaultDueDays: 14,
        hideAdjustField: false,
        terms: '',
        footer: '',
        showNoticeOnViewed: true,
        showNoticeOnPaid: true,
        templateId: 'premium',
        customCSS: 'body {}'
    },
    quote: {
        prefix: 'QUO-',
        suffix: '',
        autoIncrement: true,
        nextNumber: '0001',
        defaultValidityDays: 15,
        hideAdjustField: false,
        terms: '',
        footer: '',
        showNoticeOnViewed: true,
        showNoticeOnAccepted: true,
        acceptQuoteButton: true,
        acceptedQuoteAction: 'notify_only',
        acceptQuoteText: '',
        acceptedMessage: 'You have accepted the Quote.<br>We will be in touch shortly.',
        declineReasonRequired: true,
        declinedMessage: 'You have declined the Quote.<br>We will be in touch shortly.',
        templateId: 'premium',
        customCSS: 'body {}'
    },
    payment: {
        currencySymbol: '$',
        currencyPosition: 'left',
        thousandSeparator: ',',
        decimalSeparator: '.',
        numDecimals: 2,
        paymentPage: 'Payment',
        footerText: '',
        bankDetails: '',
        genericPaymentLink: '',
        paypalGatewayEnabled: false
    },
    tax: {
        taxInclusive: false,
        taxPercentage: 0,
        taxName: 'Tax'
    },
    translate: {
        quoteLabel: 'Quote',
        quoteLabelPlural: 'Quotes',
        invoiceLabel: 'Invoice',
        invoiceLabelPlural: 'Invoices',
        qtyLabel: 'Hrs/Qty',
        serviceLabel: 'Service',
        rateLabel: 'Rate/Price',
        adjustLabel: 'Adjust',
        subTotalLabel: 'Sub Total',
        discountLabel: 'Discount',
        totalLabel: 'Total',
        totalDueLabel: 'Total Due'
    },
    emailSettings: {
        senderEmail: '',
        senderName: '',
        bccOnClientEmails: false,
        footerText: '',
        templates: [
            {
                id: 'email_tmpl_quote',
                type: 'quote_invite',
                name: 'Quote Available Notification',
                subject: 'New quote %number% available',
                content: `Hi %client_first_name%,

You have a new quote available (%number%) which can be viewed at %link%.

Thanks!`,
                buttonText: 'View this quote online'
            },
            {
                id: 'email_tmpl_invoice',
                type: 'invoice_notification',
                name: 'Invoice Issued Notification',
                subject: 'New invoice %number% available',
                content: `Hi %client_first_name%,

You have a new invoice available (%number%) which can be viewed at %link%.

Payment is due by %due_date%.

Thanks!`,
                buttonText: 'View this invoice online'
            },
            {
                id: 'email_tmpl_receipt',
                type: 'payment_received',
                name: 'Payment Receipt Notification',
                subject: 'Thanks for your payment!',
                content: `Hi %client_first_name%,

Thanks for your payment, %client_first_name%.

Your recent payment for %last_payment% on invoice %number% has been successful.

Outstanding Balance: %total_due%.

Thanks!`,
                buttonText: 'View Invoice Details'
            },
            {
                id: 'email_tmpl_reminder',
                type: 'payment_reminder',
                name: 'Payment Reminder Notification',
                subject: 'Invoice %number% Payment Reminder',
                content: `Hi %client_first_name%,

Just a friendly reminder that your invoice %number% for %total% is due on %due_date%.

Please proceed with payment at your earliest convenience.

Thanks!`,
                buttonText: 'Pay invoice online'
            }
        ]
    },
    pdf: {
        paperSize: 'A4',
        orientation: 'portrait',
        margins: 'normal'
    },
    extras: {
        activityLog: true,
        debugMode: false
    },
    licenses: {
        licenseKey: '',
        status: 'Trial'
    }
};
export const INITIAL_USER_PROFILE = {
    id: 'usr_1',
    username: 'admin',
    email: '',
    fullName: '',
    avatarUrl: '',
    notifications: {
        email: true,
        push: true
    },
    visualPreference: 'light'
};
export const INITIAL_LOGS = [];
