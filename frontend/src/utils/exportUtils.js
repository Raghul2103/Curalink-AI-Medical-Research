import jsPDF from 'jspdf';

export const exportChatToPDF = (sessionTitle, messages) => {
  const doc = new jsPDF();
  const crimson = [220, 38, 38];
  
  // Header
  doc.setFillColor(...crimson);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CURALINK', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AI MEDICAL RESEARCH INTELLIGENCE LOG', 20, 30);
  
  // Content
  let y = 50;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(`Investigation: ${sessionTitle || 'Medical Query'}`, 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
  y += 15;

  messages.forEach((msg, i) => {
    // Check for page break
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const role = msg.role === 'user' ? 'INVESTIGATOR' : 'INTELLIGENCE UNIT';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...crimson);
    doc.text(`${role}:`, 20, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const splitText = doc.splitTextToSize(msg.content, 170);
    doc.text(splitText, 20, y);
    y += (splitText.length * 5) + 10;

    // Publications / Trials
    if (msg.publications?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('ATTACHED RESEARCH ARTIFACTS:', 20, y);
      y += 6;
      doc.setFont('helvetica', 'italic');
      msg.publications.slice(0, 3).forEach(pub => {
        const title = doc.splitTextToSize(`- ${pub.title}`, 160);
        doc.text(title, 25, y);
        y += (title.length * 5) + 2;
      });
      y += 5;
    }
  });

  doc.save(`Curalink_Report_${sessionTitle?.replace(/\s+/g, '_') || 'Medical'}.pdf`);
};

export const shareConversation = async (title, content) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Curalink Research: ${title}`,
        text: content.slice(0, 200) + '...',
        url: window.location.href
      });
    } catch {}
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard for sharing');
  }
};
