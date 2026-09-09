import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { DatePickerDropdown } from '../../components/ui/DatePickerDropdown';
import { LineItemEditorModal } from '../../components/ui/LineItemEditorModal';
import { Building, FileSpreadsheet, FileSignature, CreditCard, Percent, Mail, Languages, CheckCircle2, Calendar, Pencil, PackagePlus, ChevronLeft, ChevronRight, Save, X, FileText, ShieldCheck, Sliders } from 'lucide-react';
export const Settings = () => {
    const { settings, updateSettings, invoices, quotations } = useApp();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('general');
    // Line item editor modal
    const [showLineItemEditor, setShowLineItemEditor] = useState(false);
    // local tab states
    // Tab 1: General
    const [yearStart, setYearStart] = useState(settings.general.yearStart);
    const [yearEnd, setYearEnd] = useState(settings.general.yearEnd);
    const [predefinedLineItems, setPredefinedLineItems] = useState(settings.general.predefinedLineItems);
    // Tab 2: Business
    const [bizName, setBizName] = useState(settings.business.name);
    const [bizLogo, setBizLogo] = useState(settings.business.logoUrl);
    const [bizAddress, setBizAddress] = useState(settings.business.address);
    const [bizExtra, setBizExtra] = useState(settings.business.extraInfo);
    const [bizWeb, setBizWeb] = useState(settings.business.website);
    // Logo mode: 'url' = typed URL, 'upload' = uploaded file
    const [logoMode, setLogoMode] = useState(settings.business.logoUrl?.startsWith('data:') ? 'upload' : 'url');
    const [logoFileName, setLogoFileName] = useState('');
    const [logoImgError, setLogoImgError] = useState(false);
    // Letterhead
    const [letterheadEnabled, setLetterheadEnabled] = useState(settings.business.letterheadEnabled ?? false);
    const [letterheadUrl, setLetterheadUrl] = useState(settings.business.letterheadUrl ?? '');
    const [letterheadLogoPosition, setLetterheadLogoPosition] = useState(settings.business.letterheadLogoPosition ?? 'left');
    const [letterheadShowAddress, setLetterheadShowAddress] = useState(settings.business.letterheadShowAddress ?? true);
    const [letterheadMode, setLetterheadMode] = useState(settings.business.letterheadUrl?.startsWith('data:') ? 'upload' : 'url');
    const [letterheadFileName, setLetterheadFileName] = useState('');
    const [letterheadImgError, setLetterheadImgError] = useState(false);
    // Tab 3: Invoice
    const [invPrefix, setInvPrefix] = useState(settings.invoice.prefix);
    const [invSuffix, setInvSuffix] = useState(settings.invoice.suffix ?? '');
    const [invAuto, setInvAuto] = useState(settings.invoice.autoIncrement);
    const [invNext, setInvNext] = useState(settings.invoice.nextNumber);
    const [invDue, setInvDue] = useState(settings.invoice.defaultDueDays);
    const [invHideAdjust, setInvHideAdjust] = useState(settings.invoice.hideAdjustField ?? false);
    const [invTerms, setInvTerms] = useState(settings.invoice.terms);
    const [invFooter, setInvFooter] = useState(settings.invoice.footer);
    const [invShowNoticeOnViewed, setInvShowNoticeOnViewed] = useState(settings.invoice.showNoticeOnViewed ?? true);
    const [invShowNotice, setInvShowNotice] = useState(settings.invoice.showNoticeOnPaid);
    const [invTemplateId, setInvTemplateId] = useState(settings.invoice.templateId || 'premium');
    const [invCustomCSS, setInvCustomCSS] = useState(settings.invoice.customCSS || 'body {}');
    const [customInvTemplates, setCustomInvTemplates] = useState([]);
    // Tab 4: Quote
    const [qPrefix, setQPrefix] = useState(settings.quote.prefix);
    const [qSuffix, setQSuffix] = useState(settings.quote.suffix ?? '');
    const [qAuto, setQAuto] = useState(settings.quote.autoIncrement);
    const [qNext, setQNext] = useState(settings.quote.nextNumber);
    const [qValid, setQValid] = useState(settings.quote.defaultValidityDays);
    const [qHideAdjust, setQHideAdjust] = useState(settings.quote.hideAdjustField ?? false);
    const [qTerms, setQTerms] = useState(settings.quote.terms);
    const [qFooter, setQFooter] = useState(settings.quote.footer);
    const [qAcceptBtn, setQAcceptBtn] = useState(settings.quote.acceptQuoteButton);
    const [qAcceptAction, setQAcceptAction] = useState(settings.quote.acceptedQuoteAction);
    const [qAcceptText, setQAcceptText] = useState(settings.quote.acceptQuoteText);
    const [qAcceptedMsg, setQAcceptedMsg] = useState(settings.quote.acceptedMessage);
    const [qDeclineReq, setQDeclineReq] = useState(settings.quote.declineReasonRequired);
    const [qDeclinedMsg, setQDeclinedMsg] = useState(settings.quote.declinedMessage);
    const [qShowNoticeOnViewed, setQShowNoticeOnViewed] = useState(settings.quote.showNoticeOnViewed);
    const [qShowNoticeOnAccepted, setQShowNoticeOnAccepted] = useState(settings.quote.showNoticeOnAccepted);
    const [qTemplateId, setQTemplateId] = useState(settings.quote.templateId || 'premium');
    const [qCustomCSS, setQCustomCSS] = useState(settings.quote.customCSS || 'body {}');
    const [customTemplates, setCustomTemplates] = useState([]);
    // Tab 5: Payments
    const [paySymbol, setPaySymbol] = useState(settings.payment.currencySymbol);
    const [payPosition, setPayPosition] = useState(settings.payment.currencyPosition);
    const [payThousand, setPayThousand] = useState(settings.payment.thousandSeparator);
    const [payDecimal, setPayDecimal] = useState(settings.payment.decimalSeparator);
    const [payDecimalsNum, setPayDecimalsNum] = useState(settings.payment.numDecimals);
    const [payBank, setPayBank] = useState(settings.payment.bankDetails);
    const [payGeneric, setPayGeneric] = useState(settings.payment.genericPaymentLink);
    const [payPage, setPayPage] = useState(settings.payment.paymentPage || 'Payment');
    const [payPageFooter, setPayPageFooter] = useState(settings.payment.footerText || '');
    const [payPaypalEnabled, setPayPaypalEnabled] = useState(settings.payment.paypalGatewayEnabled ?? false);
    // Tab 6: Tax
    const [taxPercentage, setTaxPercentage] = useState(settings.tax.taxPercentage);
    const [taxName, setTaxName] = useState(settings.tax.taxName);
    const [taxInclusive, setTaxInclusive] = useState(settings.tax.taxInclusive);
    // Tab 7: Translate
    const [transQuote, setTransQuote] = useState(settings.translate.quoteLabel);
    const [transQuotes, setTransQuotes] = useState(settings.translate.quoteLabelPlural);
    const [transInvoice, setTransInvoice] = useState(settings.translate.invoiceLabel);
    const [transInvoices, setTransInvoices] = useState(settings.translate.invoiceLabelPlural);
    const [transQty, setTransQty] = useState(settings.translate.qtyLabel);
    const [transService, setTransService] = useState(settings.translate.serviceLabel);
    const [transRate, setTransRate] = useState(settings.translate.rateLabel);
    const [transAdjust, setTransAdjust] = useState(settings.translate.adjustLabel);
    const [transSubTotal, setTransSubTotal] = useState(settings.translate.subTotalLabel);
    const [transDiscount, setTransDiscount] = useState(settings.translate.discountLabel);
    const [transTotal, setTransTotal] = useState(settings.translate.totalLabel);
    const [transTotalDue, setTransTotalDue] = useState(settings.translate.totalDueLabel);
    // Tab 8: Emails templates
    const [senderEmail, setSenderEmail] = useState(settings.emailSettings.senderEmail);
    const [senderName, setSenderName] = useState(settings.emailSettings.senderName);
    const [bccOnClient, setBccOnClient] = useState(settings.emailSettings.bccOnClientEmails);
    const [emailFooter, setEmailFooter] = useState(settings.emailSettings.footerText ?? '');
    const quoteTemplate = settings.emailSettings.templates.find(t => t.type === 'quote_invite');
    const invoiceTemplate = settings.emailSettings.templates.find(t => t.type === 'invoice_notification');
    const receiptTemplate = settings.emailSettings.templates.find(t => t.type === 'payment_received');
    const reminderTemplate = settings.emailSettings.templates.find(t => t.type === 'payment_reminder');
    const [qTmplSubject, setQTmplSubject] = useState(quoteTemplate?.subject ?? 'New quote %number% available');
    const [qTmplContent, setQTmplContent] = useState(quoteTemplate?.content ?? '');
    const [qTmplButtonText, setQTmplButtonText] = useState(quoteTemplate?.buttonText ?? 'View this quote online');
    const [invTmplSubject, setInvTmplSubject] = useState(invoiceTemplate?.subject ?? 'New invoice %number% available');
    const [invTmplContent, setInvTmplContent] = useState(invoiceTemplate?.content ?? '');
    const [invTmplButtonText, setInvTmplButtonText] = useState(invoiceTemplate?.buttonText ?? 'View this invoice online');
    const [payRecTmplSubject, setPayRecTmplSubject] = useState(receiptTemplate?.subject ?? 'Thanks for your payment!');
    const [payRecTmplContent, setPayRecTmplContent] = useState(receiptTemplate?.content ?? '');
    const [payRecTmplButtonText, setPayRecTmplButtonText] = useState(receiptTemplate?.buttonText ?? 'View Invoice Details');
    const [remTmplSubject, setRemTmplSubject] = useState(reminderTemplate?.subject ?? 'A friendly reminder');
    const [remTmplContent, setRemTmplContent] = useState(reminderTemplate?.content ?? '');
    const [remTmplButtonText, setRemTmplButtonText] = useState(reminderTemplate?.buttonText ?? 'Pay invoice online');
    const [remSchedule, setRemSchedule] = useState([
        '7_before', '1_before', 'due_date', '1_after', '7_after', '14_after', '21_after', '30_after'
    ]);
    // Tab: PDF Settings
    const [pdfPaperSize, setPdfPaperSize] = useState(settings.pdf?.paperSize ?? 'A4');
    const [pdfOrientation, setPdfOrientation] = useState(settings.pdf?.orientation ?? 'portrait');
    const [pdfMargins, setPdfMargins] = useState(settings.pdf?.margins ?? 'normal');
    // Tab: Extras
    const [extrasActivityLog, setExtrasActivityLog] = useState(settings.extras?.activityLog ?? true);
    const [extrasDebugMode, setExtrasDebugMode] = useState(settings.extras?.debugMode ?? false);
    // Tab: Licenses
    const [licenseKey, setLicenseKey] = useState(settings.licenses?.licenseKey ?? 'AKEY-TRIAL-8839-2910-3882');
    const [licenseStatus, setLicenseStatus] = useState(settings.licenses?.status ?? 'Active');
    // ── Validation ────────────────────────────────────────
    const [errors, setErrors] = useState({});
    // Clear a single error when user fills the field
    const clearErr = (key) => setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            showToast('error', 'Invalid File', 'Please select a valid image file (PNG, JPG, SVG, WebP, etc.)');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast('error', 'File Too Large', 'Logo image must be under 2 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setBizLogo(reader.result);
                setLogoFileName(file.name);
                setLogoImgError(false);
            }
        };
        reader.readAsDataURL(file);
        // reset input so same file can be re-selected
        e.target.value = '';
    };
    const handleLetterheadUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            showToast('error', 'Invalid File', 'Please select a valid image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('error', 'File Too Large', 'Letterhead image must be under 5 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setLetterheadUrl(reader.result);
                setLetterheadFileName(file.name);
                setLetterheadImgError(false);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    const handleTemplateUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const newId = `custom_${Date.now()}`;
                const isImg = file.type.startsWith('image/');
                const newTemplate = {
                    id: newId,
                    name: file.name.replace(/\.[^/.]+$/, ""), // strip extension
                    previewUrl: isImg ? reader.result : undefined,
                    type: file.type
                };
                setCustomTemplates(prev => [...prev, newTemplate]);
                setQTemplateId(newId);
                showToast('success', 'Template Uploaded', `Custom template "${newTemplate.name}" uploaded successfully!`);
            }
        };
        if (file.type.startsWith('image/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.type === 'text/html' || file.type === 'text/css') {
            reader.readAsDataURL(file);
        }
        else {
            showToast('error', 'Invalid File Type', 'Please upload a valid HTML, CSS, or image preview file.');
        }
    };
    const handleRemoveTemplate = (id, e) => {
        e.stopPropagation();
        setCustomTemplates(prev => prev.filter(t => t.id !== id));
        if (qTemplateId === id) {
            setQTemplateId('premium');
        }
        showToast('success', 'Template Cleared', 'Custom template has been removed.');
    };
    const handleInvTemplateUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const newId = `custom_${Date.now()}`;
                const isImg = file.type.startsWith('image/');
                const newTemplate = {
                    id: newId,
                    name: file.name.replace(/\.[^/.]+$/, ""), // strip extension
                    previewUrl: isImg ? reader.result : undefined,
                    type: file.type
                };
                setCustomInvTemplates(prev => [...prev, newTemplate]);
                setInvTemplateId(newId);
                showToast('success', 'Template Uploaded', `Custom template "${newTemplate.name}" uploaded successfully!`);
            }
        };
        if (file.type.startsWith('image/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.type === 'text/html' || file.type === 'text/css') {
            reader.readAsDataURL(file);
        }
        else {
            showToast('error', 'Invalid File Type', 'Please upload a valid HTML, CSS, or image preview file.');
        }
    };
    const handleRemoveInvTemplate = (id, e) => {
        e.stopPropagation();
        setCustomInvTemplates(prev => prev.filter(t => t.id !== id));
        if (invTemplateId === id) {
            setInvTemplateId('premium');
        }
        showToast('success', 'Template Cleared', 'Custom template has been removed.');
    };
    const validate = () => {
        const e = {};
        // Tab: general
        if (!yearStart)
            e['yearStart'] = 'Fiscal year start date is required';
        if (!yearEnd)
            e['yearEnd'] = 'Fiscal year end date is required';
        if (!predefinedLineItems.trim())
            e['predefinedLineItems'] = 'At least one pre-defined line item is required';
        // Tab: business
        if (!bizName.trim())
            e['bizName'] = 'Business name is required';
        if (!bizAddress.trim())
            e['bizAddress'] = 'Registered address is required';
        // Tab: invoice
        if (!String(invNext).trim())
            e['invNext'] = 'Next invoice number is required';
        if (!invTerms.trim())
            e['invTerms'] = 'Default terms & conditions are required';
        // Tab: quote
        if (!String(qNext).trim())
            e['qNext'] = 'Next quotation number is required';
        // Tab: payment
        if (!paySymbol.trim())
            e['paySymbol'] = 'Currency symbol is required';
        if (!payThousand.trim())
            e['payThousand'] = 'Thousand separator is required';
        if (!payDecimal.trim())
            e['payDecimal'] = 'Decimal separator is required';
        // Tab: tax
        if (!taxName.trim())
            e['taxName'] = 'Tax name is required';
        // Tab: emails
        if (!senderEmail.trim())
            e['senderEmail'] = 'Sender email is required';
        if (!senderName.trim())
            e['senderName'] = 'Sender name is required';
        // Tab: translate
        if (!transQuote.trim())
            e['transQuote'] = 'Required';
        if (!transQuotes.trim())
            e['transQuotes'] = 'Required';
        if (!transInvoice.trim())
            e['transInvoice'] = 'Required';
        if (!transInvoices.trim())
            e['transInvoices'] = 'Required';
        if (!transQty.trim())
            e['transQty'] = 'Required';
        if (!transService.trim())
            e['transService'] = 'Required';
        if (!transRate.trim())
            e['transRate'] = 'Required';
        if (!transAdjust.trim())
            e['transAdjust'] = 'Required';
        if (!transSubTotal.trim())
            e['transSubTotal'] = 'Required';
        if (!transDiscount.trim())
            e['transDiscount'] = 'Required';
        if (!transTotal.trim())
            e['transTotal'] = 'Required';
        if (!transTotalDue.trim())
            e['transTotalDue'] = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    // ── Tab order ──────────────────────────────────────────
    const TAB_ORDER = ['general', 'business', 'quote', 'invoice', 'payment', 'tax', 'emails', 'pdf', 'translate', 'extras', 'licenses'];
    const currentTabIdx = TAB_ORDER.indexOf(activeTab);
    const isFirstTab = currentTabIdx === 0;
    const isLastTab = currentTabIdx === TAB_ORDER.length - 1;
    // ── Per-tab validator (only checks current tab fields) ─
    const validateTab = (tab) => {
        const e = { ...errors };
        // clear errors for this tab first
        const tabKeys = {
            general: ['yearStart', 'yearEnd', 'predefinedLineItems'],
            business: ['bizName', 'bizAddress'],
            invoice: ['invPrefix', 'invNext', 'invTerms'],
            quote: ['qPrefix', 'qNext'],
            payment: ['paySymbol', 'payThousand', 'payDecimal'],
            tax: ['taxName'],
            emails: ['senderEmail', 'senderName'],
            translate: ['transQuote', 'transQuotes', 'transInvoice', 'transInvoices', 'transQty',
                'transService', 'transRate', 'transAdjust', 'transSubTotal', 'transDiscount',
                'transTotal', 'transTotalDue'],
        };
        (tabKeys[tab] ?? []).forEach(k => delete e[k]);
        // add errors for this tab
        if (tab === 'general') {
            if (!yearStart)
                e['yearStart'] = 'Fiscal year start date is required';
            if (!yearEnd)
                e['yearEnd'] = 'Fiscal year end date is required';
            if (!predefinedLineItems.trim())
                e['predefinedLineItems'] = 'At least one pre-defined line item is required';
        }
        if (tab === 'business') {
            if (!bizName.trim())
                e['bizName'] = 'Business name is required';
            if (!bizAddress.trim())
                e['bizAddress'] = 'Registered address is required';
        }
        if (tab === 'invoice') {
            if (!String(invNext).trim())
                e['invNext'] = 'Next invoice number is required';
            if (!invTerms.trim())
                e['invTerms'] = 'Default terms & conditions are required';
        }
        if (tab === 'quote') {
            if (!String(qNext).trim())
                e['qNext'] = 'Next quotation number is required';
        }
        if (tab === 'payment') {
            if (!paySymbol.trim())
                e['paySymbol'] = 'Currency symbol is required';
            if (!payThousand.trim())
                e['payThousand'] = 'Thousand separator is required';
            if (!payDecimal.trim())
                e['payDecimal'] = 'Decimal separator is required';
        }
        if (tab === 'tax') {
            if (!taxName.trim())
                e['taxName'] = 'Tax name is required';
        }
        if (tab === 'emails') {
            if (!senderEmail.trim())
                e['senderEmail'] = 'Sender email is required';
            if (!senderName.trim())
                e['senderName'] = 'Sender name is required';
        }
        if (tab === 'translate') {
            if (!transQuote.trim())
                e['transQuote'] = 'Required';
            if (!transQuotes.trim())
                e['transQuotes'] = 'Required';
            if (!transInvoice.trim())
                e['transInvoice'] = 'Required';
            if (!transInvoices.trim())
                e['transInvoices'] = 'Required';
            if (!transQty.trim())
                e['transQty'] = 'Required';
            if (!transService.trim())
                e['transService'] = 'Required';
            if (!transRate.trim())
                e['transRate'] = 'Required';
            if (!transAdjust.trim())
                e['transAdjust'] = 'Required';
            if (!transSubTotal.trim())
                e['transSubTotal'] = 'Required';
            if (!transDiscount.trim())
                e['transDiscount'] = 'Required';
            if (!transTotal.trim())
                e['transTotal'] = 'Required';
            if (!transTotalDue.trim())
                e['transTotalDue'] = 'Required';
        }
        setErrors(e);
        // return true only if no new errors for this tab
        return (tabKeys[tab] ?? []).every(k => !e[k]);
    };
    // ── Navigate to next tab (validate current first) ──────
    const handleNext = () => {
        if (!validateTab(activeTab)) {
            showToast('error', 'Incomplete', 'Please fill in all required fields on this tab before continuing.');
            return;
        }
        if (!isLastTab) {
            setActiveTab(TAB_ORDER[currentTabIdx + 1]);
        }
    };
    // ── Navigate to previous tab (no validation) ───────────
    const handlePrev = () => {
        if (!isFirstTab)
            setActiveTab(TAB_ORDER[currentTabIdx - 1]);
    };
    // Which tabs have errors — for badge display
    const tabErrors = {
        general: !!(errors.yearStart || errors.yearEnd || errors.predefinedLineItems),
        business: !!(errors.bizName || errors.bizAddress),
        invoice: !!(errors.invNext || errors.invTerms),
        quote: !!(errors.qNext),
        pdf: false,
        payment: !!(errors.paySymbol || errors.payThousand || errors.payDecimal),
        tax: !!(errors.taxName),
        emails: !!(errors.senderEmail || errors.senderName),
        translate: !!(errors.transQuote || errors.transQuotes || errors.transInvoice || errors.transInvoices ||
            errors.transQty || errors.transService || errors.transRate || errors.transAdjust ||
            errors.transSubTotal || errors.transDiscount || errors.transTotal || errors.transTotalDue),
        extras: false,
        licenses: false,
    };
    const handleSave = () => {
        const isValid = validate();
        if (!isValid) {
            const tabOrder = ['general', 'business', 'quote', 'invoice', 'payment', 'tax', 'emails', 'pdf', 'translate', 'extras', 'licenses'];
            const firstBad = tabOrder.find(t => tabErrors[t]);
            if (firstBad)
                setActiveTab(firstBad);
            showToast('error', 'Validation Failed', 'Please fill in all required fields before saving.');
            return;
        }
        updateSettings({
            general: { yearStart, yearEnd, predefinedLineItems },
            business: { name: bizName, logoUrl: bizLogo, address: bizAddress, extraInfo: bizExtra, website: bizWeb,
                letterheadEnabled, letterheadUrl, letterheadLogoPosition, letterheadShowAddress },
            invoice: {
                prefix: invPrefix,
                suffix: invSuffix,
                autoIncrement: invAuto,
                nextNumber: invNext,
                defaultDueDays: Number(invDue),
                hideAdjustField: invHideAdjust,
                terms: invTerms,
                footer: invFooter,
                showNoticeOnViewed: invShowNoticeOnViewed,
                showNoticeOnPaid: invShowNotice,
                templateId: invTemplateId,
                customCSS: invCustomCSS
            },
            quote: {
                prefix: qPrefix,
                suffix: qSuffix,
                autoIncrement: qAuto,
                nextNumber: qNext,
                defaultValidityDays: Number(qValid),
                hideAdjustField: qHideAdjust,
                terms: qTerms,
                footer: qFooter,
                showNoticeOnViewed: qShowNoticeOnViewed,
                showNoticeOnAccepted: qShowNoticeOnAccepted,
                acceptQuoteButton: qAcceptBtn,
                acceptedQuoteAction: qAcceptAction,
                acceptQuoteText: qAcceptText,
                acceptedMessage: qAcceptedMsg,
                declineReasonRequired: qDeclineReq,
                declinedMessage: qDeclinedMsg,
                templateId: qTemplateId,
                customCSS: qCustomCSS
            },
            payment: {
                currencySymbol: paySymbol,
                currencyPosition: payPosition,
                thousandSeparator: payThousand,
                decimalSeparator: payDecimal,
                numDecimals: Number(payDecimalsNum),
                paymentPage: payPage,
                footerText: payPageFooter,
                bankDetails: payBank,
                genericPaymentLink: payGeneric,
                paypalGatewayEnabled: payPaypalEnabled
            },
            tax: { taxInclusive, taxPercentage: Number(taxPercentage), taxName },
            translate: {
                quoteLabel: transQuote, quoteLabelPlural: transQuotes,
                invoiceLabel: transInvoice, invoiceLabelPlural: transInvoices,
                qtyLabel: transQty, serviceLabel: transService, rateLabel: transRate,
                adjustLabel: transAdjust, subTotalLabel: transSubTotal, discountLabel: transDiscount,
                totalLabel: transTotal, totalDueLabel: transTotalDue
            },
            emailSettings: {
                senderEmail,
                senderName,
                bccOnClientEmails: bccOnClient,
                footerText: emailFooter,
                templates: [
                    {
                        id: 'email_tmpl_quote',
                        type: 'quote_invite',
                        name: 'Quote Available Notification',
                        subject: qTmplSubject,
                        content: qTmplContent,
                        buttonText: qTmplButtonText
                    },
                    {
                        id: 'email_tmpl_invoice',
                        type: 'invoice_notification',
                        name: 'Invoice Issued Notification',
                        subject: invTmplSubject,
                        content: invTmplContent,
                        buttonText: invTmplButtonText
                    },
                    {
                        id: 'email_tmpl_receipt',
                        type: 'payment_received',
                        name: 'Payment Receipt Notification',
                        subject: payRecTmplSubject,
                        content: payRecTmplContent,
                        buttonText: payRecTmplButtonText
                    },
                    {
                        id: 'email_tmpl_reminder',
                        type: 'payment_reminder',
                        name: 'Payment Reminder Notification',
                        subject: remTmplSubject,
                        content: remTmplContent,
                        buttonText: remTmplButtonText
                    }
                ]
            },
            pdf: {
                paperSize: pdfPaperSize,
                orientation: pdfOrientation,
                margins: pdfMargins
            },
            extras: {
                activityLog: extrasActivityLog,
                debugMode: extrasDebugMode
            },
            licenses: {
                licenseKey: licenseKey,
                status: licenseStatus
            }
        });
        showToast('success', 'Configuration Saved', 'All settings saved successfully.');
    };
    const menuItems = [
        { id: 'general', label: 'General Settings', icon: <Calendar className="h-4 w-4"/> },
        { id: 'business', label: 'Business Profile', icon: <Building className="h-4 w-4"/> },
        { id: 'quote', label: 'Quotation Rules', icon: <FileSignature className="h-4 w-4"/> },
        { id: 'invoice', label: 'Invoice Rules', icon: <FileSpreadsheet className="h-4 w-4"/> },
        { id: 'payment', label: 'Payments & Gateway', icon: <CreditCard className="h-4 w-4"/> },
        { id: 'tax', label: 'Tax & Duties', icon: <Percent className="h-4 w-4"/> },
        { id: 'emails', label: 'SMTP Templates', icon: <Mail className="h-4 w-4"/> },
        { id: 'pdf', label: 'PDF Settings', icon: <FileText className="h-4 w-4"/> },
        { id: 'translate', label: 'Translate', icon: <Languages className="h-4 w-4"/> },
        { id: 'extras', label: 'Extras', icon: <Sliders className="h-4 w-4"/> },
        { id: 'licenses', label: 'Licenses', icon: <ShieldCheck className="h-4 w-4"/> },
    ];
    return (<div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">Invoices Settings</h1>
          <p className="text-sm text-slate-500">Configure invoice options, payments, and SMTP setups.</p>
        </div>
        <Button variant="ghost" onClick={handleSave} leftIcon={<Save className="h-4 w-4"/>}>
          Save All
        </Button>
      </div>

      {/* ── Progress bar ────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Step {currentTabIdx + 1} of {TAB_ORDER.length}</span>
          <span>{menuItems[currentTabIdx]?.label}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((currentTabIdx + 1) / TAB_ORDER.length) * 100}%` }}/>
        </div>
      </div>

      {/* Main Grid: Left navigation vertical tabs, right contents panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Tab Menu */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-1">
          {menuItems.map((item) => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${activeTab === item.id
                ? 'bg-blue-50/70 text-primary dark:bg-blue-950/20 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {tabErrors[item.id] && (<span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="This tab has required fields missing"/>)}
            </button>))}
        </div>

        {/* Tab panels content wrapper */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[400px]">
          
          {/* TAB 1: General settings */}
          {activeTab === 'general' && (<div className="space-y-6">
              <h2 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">General Settings</h2>

              {/* Fiscal Year Date Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <DatePickerDropdown label={<><span>Year Start</span><span className="text-red-500 ml-0.5">*</span></>} value={yearStart} onChange={(v) => { setYearStart(v); clearErr('yearStart'); }} placeholder="Select start date" helperText='The start date of the fiscal year'/>
                  {errors.yearStart && <p className="text-xs font-medium text-red-500 flex items-center gap-1"><span>⚠</span>{errors.yearStart}</p>}
                </div>
                <div className="space-y-1">
                  <DatePickerDropdown label={<><span>Year End</span><span className="text-red-500 ml-0.5">*</span></>} value={yearEnd} onChange={(v) => { setYearEnd(v); clearErr('yearEnd'); }} placeholder="Select end date" helperText='The end date of the fiscal year'/>
                  {errors.yearEnd && <p className="text-xs font-medium text-red-500 flex items-center gap-1"><span>⚠</span>{errors.yearEnd}</p>}
                </div>
              </div>

              {/* Live Preview Banner */}
              {yearStart && yearEnd && (<div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0"/>
                  <p className="text-blue-700 dark:text-blue-300 font-semibold">
                    Active Fiscal Year: <span className="font-black">
                      {(() => {
                    const [sm, sd] = yearStart.split('-');
                    const [em, ed] = yearEnd.split('-');
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${months[parseInt(sm) - 1]} ${parseInt(sd)} → ${months[parseInt(em) - 1]} ${parseInt(ed)}`;
                })()}
                    </span>
                  </p>
                </div>)}

              {/* ── Pre-Defined Line Items ── */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pre-Defined Line Items <span className="text-red-500">*</span>
                  </label>
                  <button type="button" onClick={() => setShowLineItemEditor(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-colors cursor-pointer">
                    <PackagePlus className="h-3.5 w-3.5"/>
                    {predefinedLineItems.trim() ? 'Edit Items' : 'Add Items'}
                  </button>
                </div>

                {/* Clickable preview area — opens editor */}
                <div role="button" tabIndex={0} onClick={() => setShowLineItemEditor(true)} onKeyDown={e => e.key === 'Enter' && setShowLineItemEditor(true)} className={`w-full rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-primary/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 ${errors.predefinedLineItems
                ? 'border-red-400 dark:border-red-500 bg-red-50/20'
                : 'border-slate-300 dark:border-slate-700'}`}>
                  {predefinedLineItems.trim() ? (
            /* Parsed line previews */
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {predefinedLineItems.trim().split('\n').filter(Boolean).map((line, i) => {
                    const parts = line.split('|').map(p => p.trim());
                    return (<div key={i} className="flex items-center gap-4 px-4 py-2.5 group">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{parts[1] ?? '—'}</p>
                              {parts[3] && <p className="text-[10px] text-slate-400 truncate">{parts[3]}</p>}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-500">Qty: {parts[0] ?? 1}</span>
                              <span className="text-xs font-bold text-primary font-mono">₹{parts[2] ?? '0'}</span>
                            </div>
                          </div>);
                })}
                      {/* Edit hint */}
                      <div className="flex items-center justify-center gap-1.5 py-2 text-[10px] text-slate-400 dark:text-slate-600">
                        <Pencil className="h-3 w-3"/> Click to edit items
                      </div>
                    </div>) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
                      <PackagePlus className="h-8 w-8 opacity-30"/>
                      <p className="text-xs font-semibold">No items defined yet</p>
                      <p className="text-[10px]">Click to open the item editor</p>
                    </div>)}
                </div>

                {errors.predefinedLineItems && (<p className="text-xs font-medium text-red-500 flex items-center gap-1">
                    <span>⚠</span>{errors.predefinedLineItems}
                  </p>)}
              </div>
            </div>)}

          {/* TAB 2: Business profile */}
          {activeTab === 'business' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">Business Details Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Logo Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Logo</label>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG or WebP · max 2 MB</p>
                </div>
                <div className="md:col-span-9 space-y-3">

                  {/* Mode Tab Switch */}
                  <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
                    <button type="button" onClick={() => { setLogoMode('url'); }} className={`px-4 py-1.5 transition-colors cursor-pointer ${logoMode === 'url'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      URL
                    </button>
                    <button type="button" onClick={() => { setLogoMode('upload'); }} className={`px-4 py-1.5 transition-colors cursor-pointer ${logoMode === 'upload'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      Upload File
                    </button>
                  </div>

                  {/* URL Input */}
                  {logoMode === 'url' && (<div className="space-y-1">
                      <input type="text" value={bizLogo?.startsWith('data:') ? '' : bizLogo} onChange={(e) => {
                    setBizLogo(e.target.value);
                    setLogoImgError(false);
                }} placeholder="https://yourdomain.com/logo.png" className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                        Enter a direct image URL. The image must be publicly accessible.
                      </p>
                    </div>)}

                  {/* File Upload Zone */}
                  {logoMode === 'upload' && (<div className="space-y-2">
                      <input type="file" id="logo-upload-input" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-900/40" onClick={() => document.getElementById('logo-upload-input')?.click()} onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }} onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary'); }} onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary');
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                        const mockEvent = { target: { files: [file], value: '' } };
                        handleLogoUpload(mockEvent);
                    }
                }}>
                        <svg className="h-8 w-8 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                        </svg>
                        {logoFileName && bizLogo?.startsWith('data:') ? (<>
                            <span className="text-xs font-semibold text-primary">{logoFileName}</span>
                            <span className="text-[10px] text-slate-400">Click to change file</span>
                          </>) : (<>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Click to upload or drag &amp; drop</span>
                            <span className="text-[10px] text-slate-400">PNG, JPG, SVG, WebP — max 2 MB</span>
                          </>)}
                      </div>
                    </div>)}

                  {/* Logo Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Preview</span>
                    <div className="w-56 h-24 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden relative group" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='rgba(100,116,139,0.07)'/%3E%3Crect x='8' y='8' width='8' height='8' fill='rgba(100,116,139,0.07)'/%3E%3C/svg%3E")`,
                backgroundSize: '16px 16px'
            }}>
                      {bizLogo && !logoImgError ? (<>
                          <img src={bizLogo} alt="Business Logo Preview" className="max-w-full max-h-full object-contain p-2" onError={() => setLogoImgError(true)} onLoad={() => setLogoImgError(false)}/>
                          <button type="button" onClick={() => { setBizLogo(''); setLogoFileName(''); setLogoImgError(false); }} className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow" title="Remove logo">
                            <X className="h-3 w-3"/>
                          </button>
                        </>) : bizLogo && logoImgError ? (<div className="flex flex-col items-center gap-1 text-red-400">
                          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                          <span className="text-[10px] font-semibold">Cannot load image</span>
                          <button type="button" onClick={() => { setBizLogo(''); setLogoImgError(false); }} className="text-[10px] underline cursor-pointer">Clear</button>
                        </div>) : (<div className="flex flex-col items-center gap-1 text-slate-400">
                          <svg className="h-7 w-7 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                          <span className="text-[10px] font-medium">No logo configured</span>
                        </div>)}
                    </div>
                  </div>

                </div>

                {/* Business Name Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={bizName} onChange={(e) => { setBizName(e.target.value); clearErr('bizName'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.bizName ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.bizName && <p className="text-xs font-medium text-red-500">⚠ {errors.bizName}</p>}
                </div>

                {/* Address Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Address <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={bizAddress} onChange={(e) => { setBizAddress(e.target.value); clearErr('bizAddress'); }} className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.bizAddress ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`} rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Add your full address and format it anyway you like. Basic HTML is allowed.
                  </p>
                  {errors.bizAddress && <p className="text-xs font-medium text-red-500">⚠ {errors.bizAddress}</p>}
                </div>

                {/* Extra Business Info Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Extra Business Info</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={bizExtra} onChange={(e) => setBizExtra(e.target.value)} className="w-full font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Extra business info such as Business Number, phone number or email address and format it anyway you like. Basic HTML is allowed. You can add your VAT number or ABN here.
                  </p>
                </div>

                {/* Website Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Website</label>
                </div>
                <div className="md:col-span-9">
                  <input type="text" value={bizWeb} onChange={(e) => setBizWeb(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                </div>

              </div>

              {/* ─── LETTERHEAD SECTION ─── */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Letterhead</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">A branded banner printed at the top of every invoice and quotation PDF.</p>
                  </div>
                  <button type="button" onClick={() => setLetterheadEnabled(!letterheadEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${letterheadEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${letterheadEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
                  </button>
                </div>

                {letterheadEnabled && (<div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 items-start">

                    {/* Letterhead Image */}
                    <div className="md:col-span-3 pt-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Letterhead Image</label>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">PNG, JPG or WebP · max 5 MB<br />Recommended: 794 × 120 px</p>
                    </div>
                    <div className="md:col-span-9 space-y-3">
                      {/* Mode tab */}
                      <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
                        {['url', 'upload'].map(m => (<button key={m} type="button" onClick={() => setLetterheadMode(m)} className={`px-4 py-1.5 transition-colors cursor-pointer ${letterheadMode === m
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            {m === 'url' ? 'URL' : 'Upload File'}
                          </button>))}
                      </div>

                      {letterheadMode === 'url' && (<div className="space-y-1">
                          <input type="text" value={letterheadUrl?.startsWith('data:') ? '' : letterheadUrl} onChange={(e) => { setLetterheadUrl(e.target.value); setLetterheadImgError(false); }} placeholder="https://yourdomain.com/letterhead.png" className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100"/>
                          <p className="text-[11px] text-slate-400 italic">Enter a direct, publicly-accessible image URL.</p>
                        </div>)}

                      {letterheadMode === 'upload' && (<div>
                          <input type="file" id="letterhead-upload-input" accept="image/*" className="hidden" onChange={handleLetterheadUpload}/>
                          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-900/40" onClick={() => document.getElementById('letterhead-upload-input')?.click()} onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }} onDragLeave={(e) => e.currentTarget.classList.remove('border-primary')} onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary');
                        const file = e.dataTransfer.files?.[0];
                        if (file)
                            handleLetterheadUpload({ target: { files: [file], value: '' } });
                    }}>
                            <svg className="h-8 w-8 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                            </svg>
                            {letterheadFileName && letterheadUrl?.startsWith('data:') ? (<><span className="text-xs font-semibold text-primary">{letterheadFileName}</span><span className="text-[10px] text-slate-400">Click to change file</span></>) : (<><span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Click to upload or drag &amp; drop</span><span className="text-[10px] text-slate-400">PNG, JPG, WebP — max 5 MB</span></>)}
                          </div>
                        </div>)}

                      {/* Live preview */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Preview</span>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
                          <div className={`relative w-full h-20 flex items-center px-5 bg-slate-50 dark:bg-slate-900/60 ${letterheadLogoPosition === 'center' ? 'justify-center' :
                    letterheadLogoPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                            {letterheadUrl && !letterheadImgError ? (<img src={letterheadUrl} alt="Letterhead Preview" className="max-h-16 max-w-full object-contain" onError={() => setLetterheadImgError(true)} onLoad={() => setLetterheadImgError(false)}/>) : letterheadUrl && letterheadImgError ? (<div className="flex flex-col items-center gap-1 text-red-400 text-[10px]">
                                <span>⚠ Cannot load image</span>
                                <button type="button" onClick={() => { setLetterheadUrl(''); setLetterheadImgError(false); }} className="underline cursor-pointer">Clear</button>
                              </div>) : bizLogo ? (<img src={bizLogo} alt="Logo" className="max-h-14 max-w-[180px] object-contain opacity-80"/>) : (<div className={`flex items-center gap-2.5 ${letterheadLogoPosition === 'center' ? 'flex-col' : ''}`}>
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">{(bizName || 'B').slice(0, 2).toUpperCase()}</div>
                                {bizName && <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{bizName}</span>}
                              </div>)}
                          </div>
                          {letterheadShowAddress && (<div className="px-5 py-1.5 bg-slate-100 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700">
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{bizAddress || 'Your business address will appear here'}</p>
                            </div>)}
                          <div className="px-5 py-4 space-y-2">
                            {[100, 75, 85, 55].map((w, i) => (<div key={i} className="h-2 rounded-full bg-slate-100 dark:bg-slate-800" style={{ width: `${w}%` }}/>))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Position */}
                    <div className="md:col-span-3 pt-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Logo Position</label>
                      <p className="text-[10px] text-slate-400 mt-1">Alignment within the letterhead band</p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
                        {['left', 'center', 'right'].map(pos => (<button key={pos} type="button" onClick={() => setLetterheadLogoPosition(pos)} className={`px-5 py-2 transition-colors cursor-pointer capitalize ${letterheadLogoPosition === pos ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            {pos}
                          </button>))}
                      </div>
                    </div>

                    {/* Address Strip toggle */}
                    <div className="md:col-span-3 pt-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Address Strip</label>
                      <p className="text-[10px] text-slate-400 mt-1">Show address below letterhead on PDFs</p>
                    </div>
                    <div className="md:col-span-9 flex items-center gap-3">
                      <button type="button" onClick={() => setLetterheadShowAddress(!letterheadShowAddress)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${letterheadShowAddress ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${letterheadShowAddress ? 'translate-x-6' : 'translate-x-1'}`}/>
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {letterheadShowAddress ? 'Address strip visible on documents' : 'Address strip hidden'}
                      </span>
                    </div>

                  </div>)}
              </div>

            </div>)}

          {/* TAB 3: Invoice rules */}
          {activeTab === 'invoice' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">Invoice Settingss</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Prefix Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prefix</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={invPrefix} onChange={(e) => setInvPrefix(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Prefix before each Invoice number. Can be left blank if you don't need a prefix.
                  </p>
                </div>

                {/* Suffix Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Suffix</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={invSuffix} onChange={(e) => setInvSuffix(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Suffix after each Invoice number. Can be left blank if you don't need a suffix.
                  </p>
                </div>

                {/* Auto Increment Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto Increment</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={invAuto} onChange={(e) => setInvAuto(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, increment Invoice numbers by one. Recommended.
                  </label>
                </div>

                {/* Next Number Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Next Number <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={invNext} onChange={(e) => { setInvNext(e.target.value); clearErr('invNext'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.invNext ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The next number to use for auto incrementing. Can use leading zeros.
                  </p>
                  {errors.invNext && <p className="text-xs font-medium text-red-500">⚠ {errors.invNext}</p>}
                </div>

                {/* Due Date Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="number" value={invDue} onChange={(e) => setInvDue(Math.max(0, parseInt(e.target.value, 10) || 0))} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Number of days each Invoice is due after the created date. This will automatically set the date in the 'Due Date' field. Can be overridden on individual Invoices.
                  </p>
                </div>

                {/* Hide Adjust Field Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hide Adjust Field</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={invHideAdjust} onChange={(e) => setInvHideAdjust(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, hide the Adjust field on line items, I won't need this field
                  </label>
                </div>

                {/* Terms & Conditions Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Terms &amp; Conditions <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={invTerms} onChange={(e) => { setInvTerms(e.target.value); clearErr('invTerms'); }} className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.invTerms ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`} rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Terms and conditions displayed on the Invoice. Can be overridden on individual Invoices.
                  </p>
                  {errors.invTerms && <p className="text-xs font-medium text-red-500">⚠ {errors.invTerms}</p>}
                </div>

                {/* Footer Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Footer</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={invFooter} onChange={(e) => setInvFooter(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The footer will be displayed at the bottom of each Invoice. Basic HTML is allowed.
                  </p>
                </div>

                {/* Admin Notices Divider */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Admin Notices</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    These settings allow you to choose which notices may be displayed in your WordPress Admin area. (Note: this is different from admin emails, which you can configure on the <span className="text-primary font-semibold">Email Settings</span> tab.)
                  </p>
                </div>

                {/* Show me notices when Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Show me notices when</label>
                </div>
                <div className="md:col-span-9 space-y-3">
                  <button type="button" onClick={() => {
                const allSelected = invShowNoticeOnViewed && invShowNotice;
                setInvShowNoticeOnViewed(!allSelected);
                setInvShowNotice(!allSelected);
            }} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900 whitespace-nowrap">
                    Select / Deselect All
                  </button>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={invShowNoticeOnViewed} onChange={(e) => setInvShowNoticeOnViewed(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                      Invoice Viewed
                    </label>
                    <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={invShowNotice} onChange={(e) => setInvShowNotice(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                      Invoice Paid
                    </label>
                  </div>
                </div>

                {/* Template Design Divider */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Template Design</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    For information on customizing your templates, please see our guide <span className="text-primary font-semibold cursor-pointer hover:underline">here</span>.
                  </p>
                </div>

                {/* Template Cards Row */}
                <div className="md:col-span-3 pt-2 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Template</label>
                  <input type="file" id="inv-template-upload-input" accept="image/*,.html,.css" className="hidden" onChange={handleInvTemplateUpload}/>
                  <button type="button" onClick={() => document.getElementById('inv-template-upload-input')?.click()} className="w-fit text-left px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900 whitespace-nowrap">
                    Upload Template File
                  </button>
                </div>
                <div className="md:col-span-9">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Classic Template Card */}
                    <div onClick={() => setInvTemplateId('classic')} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 ${invTemplateId === 'classic'
                ? 'border-primary shadow-md shadow-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col gap-1.5 shadow-xs">
                        <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded"/>
                        <div className="flex justify-between items-center mt-1">
                          <div className="w-1/4 h-1.5 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-1/5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"/>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"/>
                        <div className="space-y-1 my-1">
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-2/3 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                        </div>
                        <div className="mt-auto flex justify-end">
                          <div className="w-1/3 h-2.5 bg-slate-200 dark:bg-slate-800 rounded"/>
                        </div>
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">Classic</span>
                    </div>

                    {/* Modern Template Card */}
                    <div onClick={() => setInvTemplateId('modern')} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 ${invTemplateId === 'modern'
                ? 'border-primary shadow-md shadow-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col gap-1.5 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div className="w-1/4 h-2.5 bg-slate-200 dark:bg-slate-800 rounded"/>
                          <div className="w-1/4 h-4 bg-primary/20 rounded"/>
                        </div>
                        <div className="w-1/3 h-1.5 bg-slate-100 dark:bg-slate-900 rounded mt-2"/>
                        <div className="w-full h-6 bg-slate-50 dark:bg-slate-900/60 rounded-md p-1 mt-1 space-y-1">
                          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                          <div className="w-1/2 h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="w-1/4 h-1.5 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-1/3 h-2.5 bg-primary/20 rounded"/>
                        </div>
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">Modern</span>
                    </div>

                    {/* Premium Template Card */}
                    <div onClick={() => setInvTemplateId('premium')} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 ${invTemplateId === 'premium'
                ? 'border-primary shadow-md shadow-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col gap-1.5 shadow-xs relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"/>
                        <div className="flex justify-between items-start mt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800"/>
                          <div className="w-1/3 h-3 bg-primary/25 rounded"/>
                        </div>
                        <div className="w-2/5 h-1.5 bg-slate-100 dark:bg-slate-900 rounded mt-1.5"/>
                        <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-1"/>
                        <div className="w-full h-7 bg-slate-50 dark:bg-slate-900/60 rounded-md p-1 mt-1 space-y-1">
                          <div className="flex justify-between">
                            <div className="w-1/2 h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                            <div className="w-1/5 h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                          </div>
                          <div className="flex justify-between">
                            <div className="w-1/3 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                            <div className="w-1/6 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          </div>
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                          <div className="w-1/3 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-1/3 h-3 bg-primary rounded"/>
                        </div>
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">Premium</span>
                    </div>

                    {/* Custom Invoice Templates */}
                    {customInvTemplates.map((tmpl) => (<div key={tmpl.id} onClick={() => setInvTemplateId(tmpl.id)} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 relative group ${invTemplateId === tmpl.id
                    ? 'border-primary shadow-md shadow-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                        {/* Clear template button */}
                        <button type="button" onClick={(e) => handleRemoveInvTemplate(tmpl.id, e)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10" title="Remove custom template">
                          <X className="h-3 w-3"/>
                        </button>

                        <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col items-center justify-center gap-1.5 shadow-xs relative overflow-hidden">
                          {tmpl.previewUrl ? (<img src={tmpl.previewUrl} alt={tmpl.name} className="w-full h-full object-contain"/>) : (<div className="flex flex-col items-center gap-1">
                              <span className="text-2xl">📄</span>
                              <span className="text-[10px] font-bold text-primary uppercase font-mono">
                                {tmpl.type.includes('html') ? 'HTML' : 'CSS'}
                              </span>
                            </div>)}
                        </div>
                        <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300 truncate w-full text-center">{tmpl.name}</span>
                      </div>))}

                  </div>
                </div>

                {/* Custom CSS Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom CSS</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={invCustomCSS} onChange={(e) => setInvCustomCSS(e.target.value)} className="w-full font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Add custom CSS to your Invoices
                  </p>
                </div>

              </div>
            </div>)}



          {/* TAB 4: Quotation rules */}
          {activeTab === 'quote' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">Quotation Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Prefix Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prefix</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={qPrefix} onChange={(e) => setQPrefix(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Prefix before each Quote number. Can be left blank if you don't need a prefix.
                  </p>
                </div>

                {/* Suffix Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Suffix</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={qSuffix} onChange={(e) => setQSuffix(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Suffix after each Quote number. Can be left blank if you don't need a suffix.
                  </p>
                </div>

                {/* Auto Increment Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto Increment</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={qAuto} onChange={(e) => setQAuto(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, increment Quote numbers by one. Recommended.
                  </label>
                </div>

                {/* Next Number Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Next Number <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={qNext} onChange={(e) => { setQNext(e.target.value); clearErr('qNext'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.qNext ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The next number to use for auto incrementing. Can use leading zeros.
                  </p>
                  {errors.qNext && <p className="text-xs font-medium text-red-500">⚠ {errors.qNext}</p>}
                </div>

                {/* Quotes Valid For Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quotes Valid For</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="number" value={qValid} onChange={(e) => setQValid(Math.max(0, parseInt(e.target.value, 10) || 0))} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Number of days each Quote is valid for. This will automatically set the date in the 'Valid Until' field. Can be overridden on individual Quotes.
                  </p>
                </div>

                {/* Hide Adjust Field Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hide Adjust Field</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={qHideAdjust} onChange={(e) => setQHideAdjust(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, hide the Adjust field on line items, I won't need this field
                  </label>
                </div>

                {/* Terms & Conditions Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Terms &amp; Conditions</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={qTerms} onChange={(e) => setQTerms(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Terms and conditions displayed on the Quote. Can be overridden on individual Quotes.
                  </p>
                </div>

                {/* Footer Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Footer</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={qFooter} onChange={(e) => setQFooter(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The footer will be displayed at the bottom of each Quote. Basic HTML is allowed.
                  </p>
                </div>

                {/* Accepting Quotes Section Divider */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Accepting Quotes</h4>
                </div>

                {/* Accept Quote Button Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accept Quote Button</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={qAcceptBtn} onChange={(e) => setQAcceptBtn(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, show the "Accept Quote" button on Quotes.
                  </label>
                </div>

                {/* Accepted Quote Action Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accepted Quote Action</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <select value={qAcceptAction} onChange={(e) => setQAcceptAction(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100">
                    <option value="convert_to_invoice">Convert Quote to Invoice and send to client</option>
                    <option value="notify_only">Log in system only (manual convert)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Actions to perform automatically when client accepts a Quote.
                  </p>
                </div>

                {/* Accept Quote Text Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accept Quote Text</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={qAcceptText} onChange={(e) => setQAcceptText(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Text to add on the "Accept Quote" popup. Basic HTML is allowed. This should provide some indication to your client of what happens after accepting the Quote.
                  </p>
                </div>

                {/* Accepted Quote Message Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accepted Quote Message</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={qAcceptedMsg} onChange={(e) => setQAcceptedMsg(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Message to display if client accepts the Quote. Basic HTML is allowed. Leave blank for the default message.
                  </p>
                </div>

                {/* Decline Reason Required Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Decline Reason Required</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={qDeclineReq} onChange={(e) => setQDeclineReq(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, make the "Reason for declining" field required.
                  </label>
                </div>

                {/* Declined Quote Message Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Declined Quote Message</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={qDeclinedMsg} onChange={(e) => setQDeclinedMsg(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Message to display if client declines the Quote. Basic HTML is allowed. Leave blank for the default message.
                  </p>
                </div>

                {/* Admin Notices Divider */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Admin Notices</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    These settings allow you to choose which notices may be displayed in your WordPress Admin area. (Note: this is different from admin emails, which you can configure on the <span className="text-primary font-semibold">Email Settings</span> tab.)
                  </p>
                </div>

                {/* Show me notices when Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Show me notices when</label>
                </div>
                <div className="md:col-span-9 space-y-3">
                  <button type="button" onClick={() => {
                const allSelected = qShowNoticeOnViewed && qShowNoticeOnAccepted;
                setQShowNoticeOnViewed(!allSelected);
                setQShowNoticeOnAccepted(!allSelected);
            }} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900">
                    Select / Deselect All
                  </button>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={qShowNoticeOnViewed} onChange={(e) => setQShowNoticeOnViewed(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                      Quote Viewed
                    </label>
                    <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={qShowNoticeOnAccepted} onChange={(e) => setQShowNoticeOnAccepted(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                      Quote Accepted
                    </label>
                  </div>
                </div>

                {/* Template Design Divider */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Template Design</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    For information on customizing your templates, please see our guide <span className="text-primary font-semibold cursor-pointer hover:underline">here</span>.
                  </p>
                </div>

                {/* Template Cards Row */}
                <div className="md:col-span-3 pt-2 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Template</label>
                  <input type="file" id="template-upload-input" accept="image/*,.html,.css" className="hidden" onChange={handleTemplateUpload}/>
                  <button type="button" onClick={() => document.getElementById('template-upload-input')?.click()} className="w-fit text-left px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900 whitespace-nowrap">
                    Upload Template File
                  </button>
                </div>
                <div className="md:col-span-9">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Classic Template Card */}
                    <div onClick={() => setQTemplateId('classic')} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 ${qTemplateId === 'classic'
                ? 'border-primary shadow-md shadow-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col gap-1.5 shadow-xs">
                        <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded"/>
                        <div className="flex justify-between items-center mt-1">
                          <div className="w-1/4 h-1.5 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-1/5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"/>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"/>
                        <div className="space-y-1 my-1">
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-2/3 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                        </div>
                        <div className="mt-auto flex justify-end">
                          <div className="w-1/3 h-2.5 bg-slate-200 dark:bg-slate-800 rounded"/>
                        </div>
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">Classic</span>
                    </div>

                    {/* Modern Template Card */}
                    <div onClick={() => setQTemplateId('modern')} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 ${qTemplateId === 'modern'
                ? 'border-primary shadow-md shadow-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col gap-1.5 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div className="w-1/4 h-2.5 bg-slate-200 dark:bg-slate-800 rounded"/>
                          <div className="w-1/4 h-4 bg-primary/20 rounded"/>
                        </div>
                        <div className="w-1/3 h-1.5 bg-slate-100 dark:bg-slate-900 rounded mt-2"/>
                        <div className="w-full h-6 bg-slate-50 dark:bg-slate-900/60 rounded-md p-1 mt-1 space-y-1">
                          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                          <div className="w-1/2 h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="w-1/4 h-1.5 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-1/3 h-2.5 bg-primary/20 rounded"/>
                        </div>
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">Modern</span>
                    </div>

                    {/* Premium Template Card (Selected by default) */}
                    <div onClick={() => setQTemplateId('premium')} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 ${qTemplateId === 'premium'
                ? 'border-primary shadow-md shadow-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col gap-1.5 shadow-xs relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"/>
                        <div className="flex justify-between items-start mt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800"/>
                          <div className="w-1/3 h-3 bg-primary/25 rounded"/>
                        </div>
                        <div className="w-2/5 h-1.5 bg-slate-100 dark:bg-slate-900 rounded mt-1.5"/>
                        <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-1"/>
                        <div className="w-full h-7 bg-slate-50 dark:bg-slate-900/60 rounded-md p-1 mt-1 space-y-1">
                          <div className="flex justify-between">
                            <div className="w-1/2 h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                            <div className="w-1/5 h-1 bg-slate-200 dark:bg-slate-800 rounded"/>
                          </div>
                          <div className="flex justify-between">
                            <div className="w-1/3 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                            <div className="w-1/6 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          </div>
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                          <div className="w-1/3 h-1 bg-slate-100 dark:bg-slate-900 rounded"/>
                          <div className="w-1/3 h-3 bg-primary rounded"/>
                        </div>
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">Premium</span>
                    </div>

                    {/* Custom Templates */}
                    {customTemplates.map((tmpl) => (<div key={tmpl.id} onClick={() => setQTemplateId(tmpl.id)} className={`cursor-pointer border-2 rounded-xl p-2.5 transition-all overflow-hidden flex flex-col items-center bg-slate-50 dark:bg-slate-900/60 relative group ${qTemplateId === tmpl.id
                    ? 'border-primary shadow-md shadow-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>
                        {/* Clear template button */}
                        <button type="button" onClick={(e) => handleRemoveTemplate(tmpl.id, e)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10" title="Remove custom template">
                          <X className="h-3 w-3"/>
                        </button>

                          <div className="w-full aspect-[3/4] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg p-2 flex flex-col items-center justify-center gap-1.5 shadow-xs relative overflow-hidden">
                          {tmpl.previewUrl ? (<img src={tmpl.previewUrl} alt={tmpl.name} className="w-full h-full object-contain"/>) : (<div className="flex flex-col items-center gap-1">
                              <span className="text-2xl">📄</span>
                              <span className="text-[10px] font-bold text-primary uppercase font-mono">
                                {tmpl.type.includes('html') ? 'HTML' : 'CSS'}
                              </span>
                            </div>)}
                        </div>
                        <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-300 truncate w-full text-center">{tmpl.name}</span>
                      </div>))}

                  </div>
                </div>


                {/* Custom CSS Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom CSS</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={qCustomCSS} onChange={(e) => setQCustomCSS(e.target.value)} className="w-full font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Add custom CSS to your Quotes
                  </p>
                </div>

              </div>
            </div>)}

          {/* TAB 5: Payments settings */}
          {activeTab === 'payment' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">Gateway &amp; Payment Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Currency Symbol Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Currency Symbol <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={paySymbol} onChange={(e) => { setPaySymbol(e.target.value); clearErr('paySymbol'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.paySymbol ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.paySymbol && <p className="text-xs font-medium text-red-500">⚠ {errors.paySymbol}</p>}
                </div>

                {/* Currency Position Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Currency Position</label>
                </div>
                <div className="md:col-span-9">
                  <select value={payPosition} onChange={(e) => setPayPosition(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100">
                    <option value="left">Left ({paySymbol}100.00)</option>
                    <option value="right">Right (100.00{paySymbol})</option>
                  </select>
                </div>

                {/* Thousand Separator Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Thousand Separator <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={payThousand} onChange={(e) => { setPayThousand(e.target.value); clearErr('payThousand'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.payThousand ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.payThousand && <p className="text-xs font-medium text-red-500">⚠ {errors.payThousand}</p>}
                </div>

                {/* Decimal Separator Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Decimal Separator <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={payDecimal} onChange={(e) => { setPayDecimal(e.target.value); clearErr('payDecimal'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.payDecimal ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.payDecimal && <p className="text-xs font-medium text-red-500">⚠ {errors.payDecimal}</p>}
                </div>

                {/* Number of Decimals Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number of Decimals</label>
                </div>
                <div className="md:col-span-9">
                  <input type="number" value={payDecimalsNum} onChange={(e) => setPayDecimalsNum(Math.max(0, parseInt(e.target.value, 10) || 0))} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                </div>

                {/* Payment Page Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payment Page</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <select value={payPage} onChange={(e) => setPayPage(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100">
                    <option value="Payment">Payment</option>
                  </select>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Choose a page to use for PayPal and other <span className="text-primary font-semibold hover:underline cursor-pointer">available payment gateway</span> messages and other confirmations. A blank page named Payment would be perfect.
                  </p>
                </div>

                {/* Payment Page Footer Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payment Page Footer</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={payPageFooter} onChange={(e) => setPayPageFooter(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The footer will be displayed at the bottom of the payment page. Basic HTML is allowed. Use this to provide additional payment instructions, if desired.
                  </p>
                </div>

                {/* Payment Methods Divider */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Payment Methods</h4>
                </div>

                {/* Bank Row */}
                <div className="md:col-span-3 pt-2 flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bank</label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Displayed on the Invoice</span>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={payBank} onChange={(e) => setPayBank(e.target.value)} className="w-full font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Add your bank account details if you wish to allow direct bank deposits. HTML is allowed.
                  </p>
                </div>

                {/* Generic Payment Row */}
                <div className="md:col-span-3 pt-2 flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Generic Payment</label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Displayed on the Invoice</span>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <textarea value={payGeneric} onChange={(e) => setPayGeneric(e.target.value)} className="w-full font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={4}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Set a generic message or include further instructions for the user on how to pay. HTML is allowed.
                  </p>
                </div>

                {/* PayPal Gateway Section */}
                <div className="md:col-span-12 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mt-3">
                  <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-outfit">PayPal Gateway</h4>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-950 space-y-2">
                    <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={payPaypalEnabled} onChange={(e) => setPayPaypalEnabled(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                      Enable PayPal Standard payment gateway integration.
                    </label>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 italic ml-6.5">
                      Enable this standard gateway if you wish to let your clients pay automatically online using PayPal account or credit cards.
                    </p>
                  </div>
                </div>

              </div>
            </div>)}

          {/* TAB 6: Tax rules */}
          {activeTab === 'tax' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">Tax Configurations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Prices entered with tax Row */}
                <div className="md:col-span-3 pt-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prices entered with tax</label>
                </div>
                <div className="md:col-span-9 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none text-slate-700 dark:text-slate-300">
                    <input type="radio" name="pricesWithTax" checked={taxInclusive} onChange={() => setTaxInclusive(true)} className="text-primary focus:ring-primary h-4 w-4"/>
                    Yes, I will enter prices inclusive of tax
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none text-slate-700 dark:text-slate-300">
                    <input type="radio" name="pricesWithTax" checked={!taxInclusive} onChange={() => setTaxInclusive(false)} className="text-primary focus:ring-primary h-4 w-4"/>
                    No, I will enter prices exclusive of tax
                  </label>
                </div>

                {/* Tax Percentage Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tax Percentage</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="number" step="any" value={taxPercentage} onChange={(e) => setTaxPercentage(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Default tax percentage. Set to 0 or leave blank for no tax.
                  </p>
                </div>

                {/* Tax Name Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tax Name <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={taxName} onChange={(e) => { setTaxName(e.target.value); clearErr('taxName'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.taxName ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The name of the tax for your country/region. GST, VAT, Tax etc
                  </p>
                  {errors.taxName && <p className="text-xs font-medium text-red-500">⚠ {errors.taxName}</p>}
                </div>

              </div>
            </div>)}

          {/* TAB 7: Emails templates */}
          {activeTab === 'emails' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">SMTP Notification Templates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Email Address Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="email" value={senderEmail} onChange={(e) => { setSenderEmail(e.target.value); clearErr('senderEmail'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.senderEmail ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The email address to send and receive notifications (probably your business email).
                  </p>
                  {errors.senderEmail && <p className="text-xs font-medium text-red-500">⚠ {errors.senderEmail}</p>}
                </div>

                {/* Email Name Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Name <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <input type="text" value={senderName} onChange={(e) => { setSenderName(e.target.value); clearErr('senderName'); }} className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${errors.senderName ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The name on emails to send and receive notifications (probably your business name).
                  </p>
                  {errors.senderName && <p className="text-xs font-medium text-red-500">⚠ {errors.senderName}</p>}
                </div>

                {/* Bcc on Client Emails Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bcc on Client Emails</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={bccOnClient} onChange={(e) => setBccOnClient(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Yes, send myself a copy of all client emails (Bcc). Recommended.
                  </label>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic ml-6.5">
                    This ensures you have a copy of the email on record
                  </p>
                </div>

                {/* SECTION: Quote Available */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Quote Available</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Sent to the client manually, when you click the email button.
                  </p>
                </div>

                {/* Quote Subject Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Subject</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={qTmplSubject} onChange={(e) => setQTmplSubject(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The subject of the email (wildcards are allowed).
                  </p>
                </div>

                {/* Quote Content Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Content</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <div className="flex justify-end gap-1 mb-1">
                    <button type="button" className="px-2.5 py-0.5 border border-primary text-primary bg-primary/5 rounded-md text-[10px] font-bold select-none cursor-default">Visual</button>
                    <button type="button" className="px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md text-[10px] font-bold select-none cursor-pointer">Code</button>
                  </div>
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-xs">
                    {/* Visual Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2 rounded-t-lg select-none">
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">B</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center italic text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">I</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center underline text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">U</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-serif text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">“</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center line-through text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">abc</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">List</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↶</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↷</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">🔗</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">×</button>
                    </div>
                    <textarea value={qTmplContent} onChange={(e) => setQTmplContent(e.target.value)} className="w-full rounded-b-lg border-t-0 border-slate-300 dark:border-slate-700 bg-transparent px-3.5 py-2 text-sm focus:outline-hidden text-slate-900 dark:text-slate-100" rows={5}/>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The content of the email (wildcards and HTML are allowed).
                  </p>
                </div>

                {/* Quote Button Text Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Button text</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={qTmplButtonText} onChange={(e) => setQTmplButtonText(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The "view this quote online" button.
                  </p>
                </div>

                {/* SECTION: Invoice Available */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Invoice Available</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Sent to the client manually, when you click the email button.
                  </p>
                </div>

                {/* Invoice Subject Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Subject</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={invTmplSubject} onChange={(e) => setInvTmplSubject(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The subject of the email (wildcards are allowed).
                  </p>
                </div>

                {/* Invoice Content Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Content</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <div className="flex justify-end gap-1 mb-1">
                    <button type="button" className="px-2.5 py-0.5 border border-primary text-primary bg-primary/5 rounded-md text-[10px] font-bold select-none cursor-default">Visual</button>
                    <button type="button" className="px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md text-[10px] font-bold select-none cursor-pointer">Code</button>
                  </div>
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-xs">
                    {/* Visual Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2 rounded-t-lg select-none">
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">B</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center italic text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">I</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center underline text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">U</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-serif text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">“</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center line-through text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">abc</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">List</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↶</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↷</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">🔗</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">×</button>
                    </div>
                    <textarea value={invTmplContent} onChange={(e) => setInvTmplContent(e.target.value)} className="w-full rounded-b-lg border-t-0 border-slate-300 dark:border-slate-700 bg-transparent px-3.5 py-2 text-sm focus:outline-hidden text-slate-900 dark:text-slate-100" rows={5}/>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The content of the email (wildcards and HTML are allowed).
                  </p>
                </div>

                {/* Invoice Button Text Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Button text</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={invTmplButtonText} onChange={(e) => setInvTmplButtonText(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The "view this invoice online" button.
                  </p>
                </div>

                {/* SECTION: Payment Received */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Payment Received</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Sent to the client automatically, when they make a payment.
                  </p>
                </div>

                {/* Receipt Subject Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Subject</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={payRecTmplSubject} onChange={(e) => setPayRecTmplSubject(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The subject of the email (wildcards are allowed).
                  </p>
                </div>

                {/* Receipt Content Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Content</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <div className="flex justify-end gap-1 mb-1">
                    <button type="button" className="px-2.5 py-0.5 border border-primary text-primary bg-primary/5 rounded-md text-[10px] font-bold select-none cursor-default">Visual</button>
                    <button type="button" className="px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md text-[10px] font-bold select-none cursor-pointer">Code</button>
                  </div>
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-xs">
                    {/* Visual Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2 rounded-t-lg select-none">
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">B</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center italic text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">I</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center underline text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">U</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-serif text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">“</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center line-through text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">abc</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">List</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↶</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↷</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">🔗</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">×</button>
                    </div>
                    <textarea value={payRecTmplContent} onChange={(e) => setPayRecTmplContent(e.target.value)} className="w-full rounded-b-lg border-t-0 border-slate-300 dark:border-slate-700 bg-transparent px-3.5 py-2 text-sm focus:outline-hidden text-slate-900 dark:text-slate-100" rows={5}/>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The content of the email (wildcards and HTML are allowed).
                  </p>
                </div>

                {/* SECTION: Payment Reminder */}
                <div className="md:col-span-12 border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">Payment Reminder</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Sent to the client automatically on the chosen days.
                  </p>
                </div>

                {/* When to Send Reminder Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">When to Send</label>
                </div>
                <div className="md:col-span-9 space-y-3">
                  <button type="button" onClick={() => {
                const allOptions = ['7_before', '1_before', 'due_date', '1_after', '7_after', '14_after', '21_after', '30_after'];
                const allSelected = allOptions.every(opt => remSchedule.includes(opt));
                setRemSchedule(allSelected ? [] : allOptions);
            }} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900 whitespace-nowrap">
                    Select / Deselect All
                  </button>
                  <div className="space-y-2">
                    {[
                { id: '7_before', label: '7 days before Due Date' },
                { id: '1_before', label: '1 day before Due Date' },
                { id: 'due_date', label: 'On the Due Date' },
                { id: '1_after', label: '1 day after Due Date' },
                { id: '7_after', label: '7 days after Due Date' },
                { id: '14_after', label: '14 days after Due Date' },
                { id: '21_after', label: '21 days after Due Date' },
                { id: '30_after', label: '30 days after Due Date' }
            ].map(opt => (<label key={opt.id} className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                        <input type="checkbox" checked={remSchedule.includes(opt.id)} onChange={(e) => {
                    if (e.target.checked) {
                        setRemSchedule(prev => [...prev, opt.id]);
                    }
                    else {
                        setRemSchedule(prev => prev.filter(x => x !== opt.id));
                    }
                }} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                        {opt.label}
                      </label>))}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Check when you would like payment reminders sent out.
                  </p>
                </div>

                {/* Reminder Subject Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Subject</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={remTmplSubject} onChange={(e) => setRemTmplSubject(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The subject of the email (wildcards are allowed).
                  </p>
                </div>

                {/* Reminder Content Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Content</label>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <div className="flex justify-end gap-1 mb-1">
                    <button type="button" className="px-2.5 py-0.5 border border-primary text-primary bg-primary/5 rounded-md text-[10px] font-bold select-none cursor-default">Visual</button>
                    <button type="button" className="px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md text-[10px] font-bold select-none cursor-pointer">Code</button>
                  </div>
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-xs">
                    {/* Visual Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2 rounded-t-lg select-none">
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">B</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center italic text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">I</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center underline text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">U</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-serif text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">“</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center line-through text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">abc</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">List</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↶</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↷</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">🔗</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">×</button>
                    </div>
                    <textarea value={remTmplContent} onChange={(e) => setRemTmplContent(e.target.value)} className="w-full rounded-b-lg border-t-0 border-slate-300 dark:border-slate-700 bg-transparent px-3.5 py-2 text-sm focus:outline-hidden text-slate-900 dark:text-slate-100" rows={5}/>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The content of the email (wildcards and HTML are allowed).
                  </p>
                </div>

                {/* SECTION: Wildcards For Emails */}
                <div className="md:col-span-12 mt-4">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-outfit">Wildcards For Emails</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                      The following wildcards can be used in email subjects and email content:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                      <div><span className="text-primary font-semibold">%client_first_name%</span>: Clients first name</div>
                      <div><span className="text-primary font-semibold">%client_last_name%</span>: Clients last name</div>
                      <div><span className="text-primary font-semibold">%client_business%</span>: Clients business</div>
                      <div><span className="text-primary font-semibold">%client_email%</span>: Clients email address</div>
                      <div><span className="text-primary font-semibold">%link%</span>: URL to the quote</div>
                      <div><span className="text-primary font-semibold">%number%</span>: The quote or invoice number</div>
                      <div><span className="text-primary font-semibold">%total%</span>: The quote or invoice total</div>
                      <div><span className="text-primary font-semibold">%last_payment%</span>: The amount of the last payment. (returns "N/A" if no payments)</div>
                      <div><span className="text-primary font-semibold">%balance%</span>: The balance outstanding on the quote or invoice</div>
                      <div><span className="text-primary font-semibold">%created%</span>: The quote or invoice created date</div>
                      <div><span className="text-primary font-semibold">%valid_until%</span>: The date the quote is valid until</div>
                      <div><span className="text-primary font-semibold">%due_date%</span>: The date the invoice is due</div>
                      <div><span className="text-primary font-semibold">%date%</span>: Todays date. Useful on Payment emails</div>
                      <div><span className="text-primary font-semibold">%order_number%</span>: The order number of the invoice</div>
                      <div><span className="text-primary font-semibold">%is_was%</span>: If due date of invoice is past, displays "was" otherwise displays "is"</div>
                    </div>
                  </div>
                </div>

                {/* Footer Text Row */}
                <div className="md:col-span-3 pt-2 mt-4">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Footer Text</label>
                </div>
                <div className="md:col-span-9 space-y-1.5 mt-4">
                  <div className="flex justify-end gap-1 mb-1">
                    <button type="button" className="px-2.5 py-0.5 border border-primary text-primary bg-primary/5 rounded-md text-[10px] font-bold select-none cursor-default">Visual</button>
                    <button type="button" className="px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md text-[10px] font-bold select-none cursor-pointer">Code</button>
                  </div>
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-xs">
                    {/* Visual Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2 rounded-t-lg select-none">
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">B</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center italic text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">I</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center underline text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">U</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center font-serif text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">“</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center line-through text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">abc</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">List</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↶</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">↷</button>
                      <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"/>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300">🔗</button>
                      <button type="button" className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">×</button>
                    </div>
                    <textarea value={emailFooter} onChange={(e) => setEmailFooter(e.target.value)} className="w-full rounded-b-lg border-t-0 border-slate-300 dark:border-slate-700 bg-transparent px-3.5 py-2 text-sm focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
                  </div>
                </div>

              </div>
            </div>)}

          {/* TAB: PDF preferences */}
          {activeTab === 'pdf' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">PDF Preview &amp; Download</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* SECTION: Download Preview Samples */}
                <div className="md:col-span-12 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-outfit">Download Document Samples</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Download sample templates to test paper size, orientation, and margins style outcomes:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => {
                const latest = invoices[0]?.id;
                if (latest) {
                    window.open(`/invoices/preview/${latest}?print=true`, '_blank');
                }
                else {
                    showToast('error', 'No Invoices', 'Please create an invoice first to download a sample.');
                }
            }} className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-95 transition-all">
                      <FileText className="h-4 w-4"/>
                      Download Invoice Sample
                    </button>
                    <button type="button" onClick={() => {
                const latest = quotations[0]?.id;
                if (latest) {
                    window.open(`/quotes/preview/${latest}?print=true`, '_blank');
                }
                else {
                    showToast('error', 'No Quotations', 'Please create a quote first to download a sample.');
                }
            }} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-500/10 active:scale-95 transition-all">
                      <FileText className="h-4 w-4"/>
                      Download Quotation Sample
                    </button>
                  </div>
                </div>

              </div>
            </div>)}

          {/* TAB 8: Translations map */}
          {activeTab === 'translate' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200 font-outfit">Translate Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Quote Label */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Quote Label</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transQuote} onChange={(e) => { setTransQuote(e.target.value); clearErr('transQuote'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transQuote ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    You can change this from Quote to Estimate or Proposal (or any other word you like).
                  </p>
                  {errors.transQuote && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transQuote}</p>}
                </div>

                {/* Quote Label Plural */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Quote Label Plural</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transQuotes} onChange={(e) => { setTransQuotes(e.target.value); clearErr('transQuotes'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transQuotes ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The plural of the above
                  </p>
                  {errors.transQuotes && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transQuotes}</p>}
                </div>

                {/* Invoice Label */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Invoice Label</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transInvoice} onChange={(e) => { setTransInvoice(e.target.value); clearErr('transInvoice'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transInvoice ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    You can change this from Invoice to Tax Invoice (or any other word you like).
                  </p>
                  {errors.transInvoice && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transInvoice}</p>}
                </div>

                {/* Invoice Label Plural */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Invoice Label Plural</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transInvoices} onChange={(e) => { setTransInvoices(e.target.value); clearErr('transInvoices'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transInvoices ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    The plural of the above
                  </p>
                  {errors.transInvoices && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transInvoices}</p>}
                </div>

                {/* Hrs/Qty */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Hrs/Qty</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transQty} onChange={(e) => { setTransQty(e.target.value); clearErr('transQty'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transQty ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transQty && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transQty}</p>}
                </div>

                {/* Service */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Service</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transService} onChange={(e) => { setTransService(e.target.value); clearErr('transService'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transService ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transService && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transService}</p>}
                </div>

                {/* Rate/Price */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Rate/Price</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transRate} onChange={(e) => { setTransRate(e.target.value); clearErr('transRate'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transRate ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transRate && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transRate}</p>}
                </div>

                {/* Adjust */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Adjust</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transAdjust} onChange={(e) => { setTransAdjust(e.target.value); clearErr('transAdjust'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transAdjust ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transAdjust && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transAdjust}</p>}
                </div>

                {/* Sub Total */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Sub Total</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transSubTotal} onChange={(e) => { setTransSubTotal(e.target.value); clearErr('transSubTotal'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transSubTotal ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transSubTotal && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transSubTotal}</p>}
                </div>

                {/* Discount */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Discount</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transDiscount} onChange={(e) => { setTransDiscount(e.target.value); clearErr('transDiscount'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transDiscount ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transDiscount && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transDiscount}</p>}
                </div>

                {/* Total */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Total</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transTotal} onChange={(e) => { setTransTotal(e.target.value); clearErr('transTotal'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transTotal ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transTotal && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transTotal}</p>}
                </div>

                {/* Total Due */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Total Due</label>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input type="text" value={transTotalDue} onChange={(e) => { setTransTotalDue(e.target.value); clearErr('transTotalDue'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.transTotalDue ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                  {errors.transTotalDue && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.transTotalDue}</p>}
                </div>

              </div>
            </div>)}

          {/* TAB: Extras settings */}
          {activeTab === 'extras' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">System Extras &amp; Utilities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* Enable Activity Log Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Activity Log</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={extrasActivityLog} onChange={(e) => setExtrasActivityLog(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Enable system activity logging automatically
                  </label>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-1.5">
                    Keep a history of invoice creates, client changes, and logins for security records.
                  </p>
                </div>

                {/* Developer Mode Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Developer Mode</label>
                </div>
                <div className="md:col-span-9">
                  <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={extrasDebugMode} onChange={(e) => setExtrasDebugMode(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4"/>
                    Enable developer debug logs console
                  </label>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-1.5">
                    Print active console outputs and API requests directly in the inspector logs.
                  </p>
                </div>

                {/* Actions Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">System Utilities</label>
                </div>
                <div className="md:col-span-9 flex flex-wrap gap-3">
                  <button type="button" onClick={() => showToast('success', 'Cache Cleared', 'System cache has been reset.')} className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900">
                    Clear Application Cache
                  </button>
                  <button type="button" onClick={() => showToast('success', 'Data Exported', 'Configuration exported successfully as JSON.')} className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900">
                    Export Settings Backup
                  </button>
                </div>

              </div>
            </div>)}

          {/* TAB: Licenses settings */}
          {activeTab === 'licenses' && (<div className="space-y-6">
              <h3 className="text-sm font-bold font-outfit border-b pb-2 text-slate-800 dark:text-slate-200">System License &amp; Credentials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 items-start">
                
                {/* License Key Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">License Key</label>
                </div>
                <div className="md:col-span-9 space-y-2">
                  <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 font-mono"/>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Enter your organization subscription serial registration license key.
                  </p>
                </div>

                {/* Status Row */}
                <div className="md:col-span-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-medium">Activation Status</label>
                </div>
                <div className="md:col-span-9 flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${licenseStatus === 'Active'
                ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400'}`}>
                    ● {licenseStatus}
                  </span>
                  <button type="button" onClick={() => {
                setLicenseStatus('Active');
                showToast('success', 'License Verified', 'License key registration status checked successfully.');
            }} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer bg-white dark:bg-slate-900">
                    Re-verify Activation
                  </button>
                </div>

                {/* Info Box */}
                <div className="md:col-span-12 mt-2">
                  <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Subscription Overview:</p>
                    <p>Current active version: <b>Enterprise Edition 2.4.0</b>. Your subscription allows unlimited quote and invoice dispatching. Renewable next year.</p>
                  </div>
                </div>

              </div>
            </div>)}

          {/* ── Tab navigation footer ─────────────────── */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">

            {/* Previous button */}
            <button type="button" onClick={handlePrev} disabled={isFirstTab} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isFirstTab
            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'}`}>
              <ChevronLeft className="h-4 w-4"/>
              Previous
            </button>

            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {TAB_ORDER.map((t, i) => (<button key={t} type="button" onClick={() => setActiveTab(t)} className={`rounded-full transition-all cursor-pointer ${i === currentTabIdx
                ? 'w-5 h-2 bg-primary'
                : tabErrors[t]
                    ? 'w-2 h-2 bg-red-400'
                    : 'w-2 h-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`} title={menuItems[i]?.label}/>))}
            </div>

            {/* Next / Save button */}
            {isLastTab ? (<button type="button" onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                <CheckCircle2 className="h-4 w-4"/>
                Save All Settings
              </button>) : (<button type="button" onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                Save &amp; Next
                <ChevronRight className="h-4 w-4"/>
              </button>)}
          </div>

        </div>

      </div>

      {/* ── Line Item Editor Modal ───────────────────── */}
      <LineItemEditorModal isOpen={showLineItemEditor} onClose={() => setShowLineItemEditor(false)} value={predefinedLineItems} onSave={(serialised) => {
            setPredefinedLineItems(serialised);
            clearErr('predefinedLineItems');
        }}/>
    </div>);
};
