import axios from 'axios';

export const fetchClinicalTrials = async (disease) => {
  try {
    // Sanitize to prevent "Too complicated query" 400 Error on ClinicalTrials API
    const safeQuery = (disease || '')
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .slice(0, 4)
      .join(' ')
      .trim();
      
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(safeQuery)}&pageSize=50&format=json`;
    const res = await axios.get(url, { timeout: 10000 });
    const studies = res.data.studies || [];

    return studies.map((study) => {
      const proto = study.protocolSection;
      const id = proto?.identificationModule;
      const status = proto?.statusModule;
      const eligibility = proto?.eligibilityModule;
      const contacts = proto?.contactsLocationsModule;

      const locations = (contacts?.locations || []).slice(0, 2)
        .map((l) => `${l.city || ''}, ${l.country || ''}`.trim())
        .join(' | ') || 'Not specified';

      const centralContacts = contacts?.centralContacts || [];
      const contact = centralContacts[0]
        ? `${centralContacts[0].name || ''} (${centralContacts[0].email || 'no email'})`
        : 'Not available';

      const eligibilityText = eligibility?.eligibilityCriteria || '';

      return {
        title: id?.briefTitle || 'No title',
        status: status?.overallStatus || 'Unknown',
        eligibility: eligibilityText.slice(0, 400),
        location: locations,
        contact,
        year: status?.startDateStruct?.date?.slice(0, 4) || 'N/A',
        url: `https://clinicaltrials.gov/study/${id?.nctId}`,
        source: 'ClinicalTrials',
        abstract: `${status?.overallStatus} trial in ${locations}`,
      };
    });
  } catch (err) {
    console.error('ClinicalTrials error:', err.response?.data || err.message);
    return [];
  }
};
