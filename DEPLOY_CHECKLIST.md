# Metzler Foundations: V1.0 "Go-Live" Compliance Checklist

**This checklist must be 100% complete before the domain is pointed to production.**

## 1. Legal & Corporate

- [ ] Incorporation: Filed as a nonprofit corporation with the Colorado Secretary of State.
- [ ] EIN: Employer Identification Number (EIN) obtained from the IRS.
- [ ] 501(c)(3) Status: Form 1023 filed with the IRS. (We can operate while pending, but must have filed).
- [ ] Charitable Solicitation: Registered with the Colorado Secretary of State under the CCSA. (CRITICAL: We cannot legally ask for donations without this).
- [ ] Insurance (D&O): Directors & Officers (D&O) Liability policy is bound.
- [ ] Insurance (Cyber): Cyber Liability policy is bound (explicitly covering CPA/HIPAA non-compliance fines).

## 2. Tech Stack & BAA Compliance

- [ ] Supabase: We are on the Team Plan (or higher).
- [ ] Supabase BAA: The Business Associate Agreement (BAA) with Supabase has been requested, signed, and countersigned.
- [ ] Keragon: We are on a paid plan (e.g., Starter).
- [ ] Keragon BAA: The BAA with Keragon has been signed and countersigned.
- [ ] Google Workspace: We are on a HIPAA-compliant plan and have signed the BAA with Google (for our staff email).

## 3. Application Security

- [ ] RLS Enabled: ALL sensitive tables (beneficiaries, applications, consents, beneficiary_outcomes) have RLS ENABLED.
- [ ] RLS Policies Tested: All RLS policies (Beneficiary, Staff, Volunteer) have been manually tested.
- [ ] Storage Buckets: All file upload buckets (for manual verification) are set to PRIVATE and have RLS policies enabled.
- [ ] Secrets: All API keys (Stripe, Keragon, The Work Number) are in Supabase Secrets Vault, not in code.

## 4. HIPAA & 42 CFR Part 2 Compliance

- [ ] Consent Management: All beneficiary interactions require explicit, documented consent.
- [ ] Data Minimization: Only collecting minimum necessary PHI for program operations.
- [ ] Encryption: All data transmission and storage is encrypted (Supabase handles this).
- [ ] Audit Logging: All data access and changes are logged for compliance reporting.
- [ ] Breach Response: Incident response plan documented and team trained.
- [ ] Data Retention: Policy established for PHI retention and deletion.

## 5. Colorado Privacy Act (CPA) Compliance

- [ ] Privacy Policy: Clear, accessible privacy policy that discloses PHI use and consumer rights.
- [ ] Do Not Sell: "Do Not Sell My Personal Information" link implemented and functional.
- [ ] Data Rights: Process for handling CPA data rights requests (access, deletion, portability).
- [ ] Controller/Processor: Clear delineation of data controller vs processor responsibilities.

## 6. Payment Processing & Financial Compliance

- [ ] Stripe Account: Business account verified and approved for nonprofit operations.
- [ ] Stripe BAA: Business Associate Agreement signed with Stripe.
- [ ] ACH Compliance: All ACH transfers comply with banking regulations.
- [ ] PCI Compliance: Payment processing meets PCI DSS requirements (Stripe handles this).
- [ ] Financial Reporting: System for generating required financial reports.

## 7. Partnership & Vendor Compliance

- [ ] MOU Templates: All partner MOUs signed and filed.
- [ ] Vendor Due Diligence: All sober living partners vetted and certified.
- [ ] Insurance Verification: All partners have required liability insurance.
- [ ] Data Sharing Agreements: BAA-equivalent agreements with all data-sharing partners.

## 8. Operational Readiness

- [ ] Staff Training: All team members trained on HIPAA, 42 CFR Part 2, and CPA compliance.
- [ ] Incident Response: Breach notification procedures documented and tested.
- [ ] Backup Systems: Data backup and disaster recovery procedures tested.
- [ ] Monitoring: Security monitoring and alerting systems active.
- [ ] Access Controls: Role-based access controls implemented and tested.

## 9. Technical Testing

- [ ] Security Testing: Penetration testing completed and vulnerabilities addressed.
- [ ] Load Testing: System can handle expected user load.
- [ ] Data Integrity: Database constraints and validations tested.
- [ ] Backup Testing: Data restoration procedures tested.
- [ ] Performance Testing: Application performance meets requirements.

## 10. Legal Review & Sign-off

- [ ] Legal Counsel Review: All contracts, policies, and procedures reviewed by legal counsel.
- [ ] Compliance Officer: Designated compliance officer appointed and trained.
- [ ] Board Approval: Board of directors has reviewed and approved go-live.
- [ ] Final Legal Sign-off: Written legal approval for production deployment.

---

## 🚨 CRITICAL REMINDERS

1. **NO EXCEPTIONS**: Do not deploy until every checkbox is marked complete.
2. **LEGAL LIABILITY**: Deploying without compliance could result in fines up to $50,000 per HIPAA violation.
3. **BOARD OVERSIGHT**: Board must explicitly approve go-live decision.
4. **DOCUMENTATION**: Keep all compliance documentation organized and accessible.
5. **REGULAR AUDITS**: Schedule quarterly compliance audits post-launch.

## 📞 Emergency Contacts

- **Legal Counsel**: [Contact Information]
- **Compliance Officer**: [Contact Information]
- **Technical Lead**: [Contact Information]
- **Board Chair**: [Contact Information]

**Last Updated**: [Date]
**Reviewed By**: [Name/Title]
