import './PairiDaizaDashboard.css';
import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Brain,
  Euro,
  Hotel,
  MapPinned,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

const DATA = {
  annual: {
    visitors2025: 2866576,
    revenueEstimatedM: 154.5,
  },
  resort: {
    nightsAvailable: 39930,
    nightsOccupied: 38143,
    occupancyRate: 95.52,
    avgRevenuePerNightEstimated: 450,
    totalRevenueEstimatedM: 17.2,
  },
  scenarios: [
    { scenario: 'Actuel', marginPerVisitor: 26.2, totalMarginM: 75.1 },
    { scenario: 'Pricing dynamique', marginPerVisitor: 29.1, totalMarginM: 83.4 },
    { scenario: 'Upsell resort', marginPerVisitor: 30.4, totalMarginM: 87.1 },
    { scenario: 'Full optimisation', marginPerVisitor: 33.8, totalMarginM: 96.9 },
  ],
  segments: [
    { name: 'Visiteurs belges', volume: 1777278, growth: 5.2, rev: 51, upsell: 'Moyen', priority: 'Maintenir & fidéliser' },
    { name: 'Visiteurs français', volume: 515983, growth: 6.8, rev: 54, upsell: 'Élevé', priority: 'Accélérer' },
    { name: 'Visiteurs néerlandais', volume: 229326, growth: 56.9, rev: 58, upsell: 'Très élevé', priority: 'Priorité #1' },
    { name: 'Visiteurs allemands', volume: 143329, growth: 41.8, rev: 60, upsell: 'Très élevé', priority: 'Priorité #2' },
    { name: 'Visiteurs resort', volume: 38143, growth: 18.5, rev: 185, upsell: 'Très élevé', priority: 'Monétiser premium' },
    { name: 'Internationaux premium', volume: 62000, growth: 28.0, rev: 140, upsell: 'Très élevé', priority: 'Construire offre dédiée' },
  ],
  markets: [
    { country: 'Belgique', share: 62, growth: 5.2, premiumPotential: 4.5 },
    { country: 'France', share: 18, growth: 6.8, premiumPotential: 6.2 },
    { country: 'Pays-Bas', share: 8, growth: 56.9, premiumPotential: 8.9 },
    { country: 'Allemagne', share: 5, growth: 41.8, premiumPotential: 8.2 },
    { country: 'Luxembourg', share: 3, growth: 30.5, premiumPotential: 6.1 },
    { country: 'Autres', share: 4, growth: 25, premiumPotential: 5.8 },
  ],
  predictions: [
    {
      title: 'Trafic 2026',
      value: '3,0M à 3,2M visiteurs',
      confidence: 'Moyenne (65%)',
      note: 'Projection hypothétique, sensible à la météo et au pricing.',
    },
    {
      title: 'CA 2026',
      value: '166M€ à 176M€',
      confidence: 'Moyenne (62%)',
      note: 'Dépend des taux de conversion upsell et de la saisonnalité.',
    },
    {
      title: 'Marge 2026',
      value: '29% à 33%',
      confidence: 'Faible à moyenne (58%)',
      note: 'Nécessite un pilotage fin coûts F&B, staffing et yield.',
    },
  ],
};

const TABS = [
  { key: 'executive', label: 'Vue exécutive' },
  { key: 'profitability', label: 'Rentabilité' },
  { key: 'segments', label: 'Segments visiteurs' },
  { key: 'resort', label: 'Resort & upsell' },
  { key: 'geography', label: 'Géographie' },
  { key: 'predictions', label: 'Prédictions IA' },
  { key: 'recommendations', label: 'Recommandations' },
];

const STATUS_COLORS = { réel: '#1f4d36', estimé: '#9b7a3c', hypothèse: '#7b5c44' };

export default function PairiDaizaDashboard() {
  const [activeTab, setActiveTab] = useState('executive');

  const revenuePerVisitor = useMemo(() => (DATA.annual.revenueEstimatedM * 1_000_000) / DATA.annual.visitors2025, []);
  const opCostPerVisitor = 27.5;
  const marginPerVisitor = revenuePerVisitor - opCostPerVisitor;
  const optimizationPotentialM = 4.5 + 2.0 + 3.2 + 1.8;

  const kpis = [
    { title: 'Visiteurs 2025', value: DATA.annual.visitors2025.toLocaleString('fr-BE'), status: 'réel', insight: 'Base solide pour arbitrer la croissance rentable.' },
    { title: 'CA estimé', value: `${DATA.annual.revenueEstimatedM}M€`, status: 'estimé', insight: 'Niveau compatible avec une stratégie de marge active.' },
    { title: 'Revenu moyen / visiteur', value: `${revenuePerVisitor.toFixed(1)}€`, status: 'estimé', insight: 'Levier clé: augmenter ce ratio sans dégrader l’expérience.' },
    { title: 'Taux occupation resort', value: `${DATA.resort.occupancyRate.toFixed(1)}%`, status: 'réel', insight: 'Capacité presque saturée: priorité à la valeur par nuit.' },
    { title: 'Revenu resort estimé', value: `${DATA.resort.totalRevenueEstimatedM}M€`, status: 'estimé', insight: 'Moteur premium à intensifier via upsell ciblé.' },
    { title: 'Potentiel optimisation annuel', value: `+${optimizationPotentialM.toFixed(1)}M€`, status: 'hypothèse', insight: 'Impact combiné des actions prioritaires CEO.' },
  ];

  const marketData = DATA.markets.map((m) => ({
    ...m,
    opportunity: ((m.share * 0.35) + (m.growth * 0.4) + (m.premiumPotential * 6 * 0.25)).toFixed(1),
  }));

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Pairi Daiza Profit Intelligence</h1>
          <p>Dashboard exploratoire IA — rentabilité, fréquentation et expérience visiteur</p>
        </div>
        <Sparkles size={24} />
      </header>

      <section className="disclaimer">
        <AlertTriangle size={18} />
        <span>Analyse exploratoire basée sur données publiques. Les montants de marge, coûts, paniers moyens et projections sont des hypothèses de travail à valider avec les données internes.</span>
      </section>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'executive' && (
        <section className="kpi-grid">
          {kpis.map((kpi) => (
            <article key={kpi.title} className="card">
              <div className="row">
                <h3>{kpi.title}</h3>
                <span className="badge" style={{ background: STATUS_COLORS[kpi.status] }}>{kpi.status}</span>
              </div>
              <strong>{kpi.value}</strong>
              <p>{kpi.insight}</p>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'profitability' && (
        <section className="panel">
          <h2><Euro size={18} /> Rentabilité par visiteur</h2>
          <div className="kpi-inline">
            <span>Revenu moyen: <b>{revenuePerVisitor.toFixed(1)}€</b> (estimé)</span>
            <span>Coût opérationnel: <b>{opCostPerVisitor.toFixed(1)}€</b> (hypothèse)</span>
            <span>Marge par visiteur: <b>{marginPerVisitor.toFixed(1)}€</b> (hypothèse)</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={DATA.scenarios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="marginPerVisitor" fill="#2e5a3f" name="Marge €/visiteur" />
              <Line yAxisId="right" dataKey="totalMarginM" stroke="#b08d57" name="Marge totale (M€)" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {activeTab === 'segments' && (
        <section className="table-wrap">
          <h2><Users size={18} /> Segments visiteurs prioritaires</h2>
          <table>
            <thead><tr><th>Segment</th><th>Volume estimé</th><th>Croissance</th><th>Revenu moyen</th><th>Potentiel upsell</th><th>Priorité business</th></tr></thead>
            <tbody>{DATA.segments.map((s) => <tr key={s.name}><td>{s.name}</td><td>{s.volume.toLocaleString('fr-BE')}</td><td>+{s.growth}%</td><td>{s.rev}€</td><td>{s.upsell}</td><td>{s.priority}</td></tr>)}</tbody>
          </table>
        </section>
      )}

      {activeTab === 'resort' && (
        <section className="panel">
          <h2><Hotel size={18} /> Resort & upsell</h2>
          <div className="kpi-inline">
            <span>Nuits disponibles: <b>{DATA.resort.nightsAvailable}</b></span>
            <span>Nuits occupées: <b>{DATA.resort.nightsOccupied}</b></span>
            <span>Taux d’occupation: <b>{DATA.resort.occupancyRate}%</b></span>
            <span>Revenu moyen/nuit: <b>{DATA.resort.avgRevenuePerNightEstimated}€</b> (estimé)</span>
            <span>Revenu total: <b>{DATA.resort.totalRevenueEstimatedM}M€</b> (estimé)</span>
            <span>Potentiel upsell: <b>+3,2M€</b> (hypothèse)</span>
          </div>
          <ul>
            <li>Packages premium multi-expériences.</li><li>Offres anniversaire/famille à forte valeur émotionnelle.</li><li>Séjours basse saison avec bonus exclusifs.</li><li>Upsell restauration signature et expériences privées.</li>
          </ul>
        </section>
      )}

      {activeTab === 'geography' && (
        <section className="panel">
          <h2><MapPinned size={18} /> Géographie & priorisation marchés</h2>
          <div className="geo">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={marketData} dataKey="share" nameKey="country" outerRadius={92} label>
                  {marketData.map((_, i) => <Cell key={i} fill={['#1f4d36','#355f47','#5c7b66','#7e8f73','#a38e6b','#b7a98e'][i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div>{marketData.sort((a,b)=>b.opportunity-a.opportunity).map((m) => <p key={m.country}><b>{m.country}</b> — Score opportunité: {m.opportunity} / 100</p>)}</div>
          </div>
          <p><b>Focus recommandé :</b> Pays-Bas, Allemagne, France.</p>
        </section>
      )}

      {activeTab === 'predictions' && (
        <section className="panel">
          <h2><Brain size={18} /> Prédictions IA (hypothétiques)</h2>
          <div className="kpi-grid">{DATA.predictions.map((p) => <article key={p.title} className="card"><h3>{p.title}</h3><strong>{p.value}</strong><p>{p.note}</p><small>Confiance: {p.confidence}</small></article>)}</div>
          <p>Variables nécessaires pour fiabiliser le modèle: météo, calendrier scolaire, prix billet, canal d’achat, taux d’occupation, restauration, boutique, avis clients.</p>
        </section>
      )}

      {activeTab === 'recommendations' && (
        <section className="table-wrap">
          <h2><Target size={18} /> 10 recommandations priorisées</h2>
          <table>
            <thead><tr><th>Titre</th><th>Impact annuel</th><th>Difficulté</th><th>Rapidité</th><th>Données nécessaires</th><th>A/B test</th><th>KPI succès</th></tr></thead>
            <tbody>{[
              ['Pricing dynamique','+4,5M€','Moyenne','3-4 mois','Pricing, calendrier, conversion','Oui','Marge/visiteur'],
              ['Bundles famille','+2,1M€','Faible','1-2 mois','Panier, segments','Oui','Panier moyen'],
              ['Upsell resort','+3,2M€','Moyenne','2-3 mois','CRM, disponibilité resort','Oui','RevPAR'],
              ['Offres basse saison','+1,8M€','Faible','1-2 mois','Demand curve','Oui','Taux remplissage'],
              ['Relance post-visite','+1,1M€','Faible','1 mois','Emails, NPS','Oui','Repeat rate'],
              ['Campagnes NL/DE','+2,6M€','Moyenne','2 mois','CAC, ROAS','Oui','Coût acquisition'],
              ['Optimisation staffing','+2,0M€','Élevée','4-6 mois','Flux horaires, RH','Pilote','Coût opérationnel'],
              ['Optimisation stocks restauration','+1,3M€','Moyenne','2-3 mois','Ventes horaires, gaspillage','Oui','Taux de perte'],
              ['Packages premium internationaux','+1,9M€','Moyenne','3 mois','Agences, profils premium','Oui','ARPU premium'],
              ['Segmentation CRM','+2,4M€','Moyenne','3 mois','RFM, transactions','Oui','LTV segment']
            ].map((r)=> <tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </section>
      )}

    </div>
  );
}
