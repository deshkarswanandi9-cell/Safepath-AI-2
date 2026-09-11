import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

def HexColor(hex_str):
    return colors.HexColor(hex_str)

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "SafeRoute AI — Project Architecture & Executive Summary")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 742, letter[0] - 54, 742)
            
        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 36, page_str)
        self.drawString(54, 36, "SafeRoute AI | Roshani Hackathon — Summary Document")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 48, letter[0] - 54, 48)
        self.restoreState()

def create_summary_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    PRIMARY = colors.HexColor("#1E3A8A")     # Deep Blue
    SECONDARY = colors.HexColor("#6D28D9")   # Purple
    ACCENT = colors.HexColor("#0D9488")      # Teal / Safe Green
    DARK = colors.HexColor("#0F172A")        # Slate 900

    styles.add(ParagraphStyle(
        name='DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=3
    ))
    
    styles.add(ParagraphStyle(
        name='DocSubtitle',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=SECONDARY,
        spaceAfter=10
    ))

    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='BodyTextCustom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=DARK,
        spaceAfter=5
    ))

    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    ))

    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=DARK
    ))

    styles.add(ParagraphStyle(
        name='TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=DARK
    ))

    story = []

    # Title & Subtitle
    story.append(Paragraph("SafeRoute AI — Project Summary", styles['DocTitle']))
    story.append(Paragraph("AI-Powered Safe Navigation & Multimodal Risk Explainability Platform for Nighttime Mobility", styles['DocSubtitle']))
    
    # Metadata Badge Box
    meta_data = [
        [
            Paragraph("<b>Repository:</b> github.com/harshal9834/roshani_hackathon", styles['TableCell']),
            Paragraph("<b>Tech Stack:</b> React 19, Vite, Tailwind CSS v4, TypeScript", styles['TableCell'])
        ],
        [
            Paragraph("<b>Focus:</b> Women's Nighttime Transit Safety", styles['TableCell']),
            Paragraph("<b>Key AI Module:</b> SHAP Feature Attribution & Anomaly Rerouting", styles['TableCell'])
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # Executive Summary
    story.append(Paragraph("1. Executive Summary & Problem Vision", styles['SectionHeader']))
    story.append(Paragraph(
        "<b>SafeRoute AI</b> is an intelligent navigation platform engineered to address the critical safety challenges women face when commuting after dark. Traditional navigation applications optimize strictly for distance and traffic velocity, often routing pedestrians through unlit alleyways, isolated pathways, or hazard zones. SafeRoute AI introduces <b>multidimensional safety scoring</b>, combining real-time municipal street lighting telemetry, pedestrian footfall density, transit proximity, and historical incident intelligence to compute verifiable safe corridors.",
        styles['BodyTextCustom']
    ))

    # Key Value Pillars
    story.append(Paragraph("2. Core AI & Safety Innovations", styles['SectionHeader']))
    
    pillars_data = [
        [
            Paragraph("<b>1. Multi-Signal Safety Engine</b>", styles['TableCellBold']),
            Paragraph("Computes real-time 0-100% safety indices using weighted parameters: continuous Lux street lighting, crowd activity index, 24/7 CCTV surveillance, and proximity to active police kiosks.", styles['TableCell'])
        ],
        [
            Paragraph("<b>2. Explainable AI (SHAP Waterfall)</b>", styles['TableCellBold']),
            Paragraph("Solves the AI 'black box' dilemma by visually breaking down feature contributions: <b>+35 pts</b> Street Lighting, <b>+22 pts</b> Crowd Activity, <b>+15 pts</b> Public Transit, penalized by <b>-12 pts</b> for nearby incident reports.", styles['TableCell'])
        ],
        [
            Paragraph("<b>3. Dynamic Anomaly Re-routing</b>", styles['TableCellBold']),
            Paragraph("Continuously monitors telemetry during live navigation. If a lighting failure or hazard is detected ahead, the app instantly alerts the user and recalculates an optimal safe bypass route.", styles['TableCell'])
        ],
        [
            Paragraph("<b>4. Emergency SOS & Refuge Hub</b>", styles['TableCellBold']),
            Paragraph("Features a 5-second countdown panic trigger, live GPS coordinate dispatch to trusted guardians, and a locator for verified 24/7 safe refuges (Police stations, 24/7 pharmacies, metro plazas).", styles['TableCell'])
        ],
        [
            Paragraph("<b>5. AI Safety Copilot</b>", styles['TableCellBold']),
            Paragraph("An embedded natural language assistant that answers real-time safety inquiries (e.g., 'Is Grand Blvd safe right now?', 'Where is the nearest help booth?').", styles['TableCell'])
        ]
    ]
    pillars_table = Table(pillars_data, colWidths=[150, 354])
    pillars_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(pillars_table)
    story.append(Spacer(1, 8))

    # Comprehensive Screen Matrix
    story.append(Paragraph("3. Complete 14-Screen Architecture & Feature Matrix", styles['SectionHeader']))
    
    screen_data = [
        [
            Paragraph("Screen / Module", styles['TableHeader']),
            Paragraph("Component File", styles['TableHeader']),
            Paragraph("Functionality & Key Highlights", styles['TableHeader'])
        ],
        [
            Paragraph("<b>1. Splash Screen</b>", styles['TableCellBold']),
            Paragraph("SplashScreen.tsx", styles['TableCell']),
            Paragraph("Branded onboarding showcasing core safety promises, AI verification, and start CTA.", styles['TableCell'])
        ],
        [
            Paragraph("<b>2. Login & Auth</b>", styles['TableCellBold']),
            Paragraph("LoginScreen.tsx", styles['TableCell']),
            Paragraph("Phone OTP authentication with biometric toggle and trusted guardian setup.", styles['TableCell'])
        ],
        [
            Paragraph("<b>3. Dashboard</b>", styles['TableCellBold']),
            Paragraph("DashboardScreen.tsx", styles['TableCell']),
            Paragraph("Central command hub: Live 94% safety index, night mode toggle, and quick SOS button.", styles['TableCell'])
        ],
        [
            Paragraph("<b>4. Route Search</b>", styles['TableCellBold']),
            Paragraph("RouteSearchScreen.tsx", styles['TableCell']),
            Paragraph("Origin & destination search with filters for lit paths, metro lines, and guarded zones.", styles['TableCell'])
        ],
        [
            Paragraph("<b>5. Route Comparison</b>", styles['TableCellBold']),
            Paragraph("RouteComparisonScreen.tsx", styles['TableCell']),
            Paragraph("Compares Route A (58%), Route B (79%), and Route C (93% Recommended safe path).", styles['TableCell'])
        ],
        [
            Paragraph("<b>6. SHAP Explainability</b>", styles['TableCellBold']),
            Paragraph("ShapExplainabilityScreen.tsx", styles['TableCell']),
            Paragraph("Interactive XAI waterfall attribution chart displaying positive and negative feature weights.", styles['TableCell'])
        ],
        [
            Paragraph("<b>7. Live Navigation</b>", styles['TableCellBold']),
            Paragraph("LiveNavigationScreen.tsx", styles['TableCell']),
            Paragraph("Turn-by-turn HUD with step safety notes, continuous lux meter, and telemetry markers.", styles['TableCell'])
        ],
        [
            Paragraph("<b>8. Safety Alert Modal</b>", styles['TableCellBold']),
            Paragraph("SafetyAlertModal.tsx", styles['TableCell']),
            Paragraph("Instant pop-up alert for sudden hazard or dark zone entry with one-click recalculate.", styles['TableCell'])
        ],
        [
            Paragraph("<b>9. Dynamic Re-routing</b>", styles['TableCellBold']),
            Paragraph("DynamicReroutingScreen.tsx", styles['TableCell']),
            Paragraph("Side-by-side comparison of original vs. newly recalculated safe bypass corridor.", styles['TableCell'])
        ],
        [
            Paragraph("<b>10. Safety Check-In</b>", styles['TableCellBold']),
            Paragraph("SafetyCheckInScreen.tsx", styles['TableCell']),
            Paragraph("Automated periodic check-in prompt: 'I Am Safe' acknowledgment or instant SOS escalation.", styles['TableCell'])
        ],
        [
            Paragraph("<b>11. Emergency SOS</b>", styles['TableCellBold']),
            Paragraph("EmergencySosScreen.tsx", styles['TableCell']),
            Paragraph("5-sec countdown panic button, siren trigger, live GPS coordinate dispatch, and refuge list.", styles['TableCell'])
        ],
        [
            Paragraph("<b>12. Trusted Contacts</b>", styles['TableCellBold']),
            Paragraph("TrustedContactsScreen.tsx", styles['TableCell']),
            Paragraph("Guardian management with real-time location sharing status and phone battery indicators.", styles['TableCell'])
        ],
        [
            Paragraph("<b>13. Safety Analytics</b>", styles['TableCellBold']),
            Paragraph("SafetyAnalyticsScreen.tsx", styles['TableCell']),
            Paragraph("Weekly safety summaries, safety trend by hour (8 PM - 1 AM), and risk factor breakdown.", styles['TableCell'])
        ],
        [
            Paragraph("<b>14. Profile & Settings</b>", styles['TableCellBold']),
            Paragraph("ProfileSettingsScreen.tsx", styles['TableCell']),
            Paragraph("Night mode configuration, sensitivity sliders, offline safe maps, and guardian prefs.", styles['TableCell'])
        ]
    ]

    screen_table = Table(screen_data, colWidths=[90, 115, 299])
    screen_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(screen_table)
    story.append(Spacer(1, 8))

    # Core Engineering Components
    story.append(Paragraph("4. Core Reusable Infrastructure & Simulation Engine", styles['SectionHeader']))
    story.append(Paragraph(
        "• <b>MapEngine.tsx:</b> Custom SVG vector map canvas supporting multi-layer risk heatmaps, polyline routing, user geolocation beacons, and interactive emergency shelter pins.<br/>"
        "• <b>MobileFrame.tsx:</b> Hardware bezel emulator with an integrated developer sidebar for switching between all 14 screens and triggering simulated hazard events.<br/>"
        "• <b>FloatingAiAssistant.tsx:</b> Embedded AI Copilot with instant prompt chips and telemetry parsing.<br/>"
        "• <b>mockData.ts:</b> Seed data structures for routes, SHAP scores, emergency help points, and analytical metrics.",
        styles['BodyTextCustom']
    ))
    story.append(Spacer(1, 6))

    # Instructions
    story.append(Paragraph("5. Execution & Build Commands", styles['SectionHeader']))
    
    cmd_data = [
        [Paragraph("<b>Command</b>", styles['TableHeader']), Paragraph("<b>Purpose</b>", styles['TableHeader'])],
        [Paragraph("<code>npm run dev</code>", styles['TableCellBold']), Paragraph("Starts the local Vite development server on port 3000 with hot module replacement.", styles['TableCell'])],
        [Paragraph("<code>npm run lint</code>", styles['TableCellBold']), Paragraph("Executes TypeScript type verification (<code>tsc --noEmit</code>) with zero compilation errors.", styles['TableCell'])],
        [Paragraph("<code>npm run build</code>", styles['TableCellBold']), Paragraph("Generates the optimized production client bundle in the <code>dist/</code> directory.", styles['TableCell'])]
    ]
    cmd_table = Table(cmd_data, colWidths=[110, 394])
    cmd_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(cmd_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully at: {output_path}")

if __name__ == '__main__':
    out_file = sys.argv[1] if len(sys.argv) > 1 else "SafeRoute_AI_Project_Summary.pdf"
    create_summary_pdf(out_file)
