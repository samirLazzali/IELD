import portraitImage from "@/assets/portrait-ines.jpg";

const APropos = () => {
  const timeline = [
    { title: "Assas", subtitle: "Droit privé" },
    { title: "EOGN", subtitle: "Formation sécurité" },
    { title: "MBA EGE", subtitle: "Intelligence économique" },
    { title: "EFB", subtitle: "École du barreau" },
    { title: "CAPA", subtitle: "Certificat d'aptitude à la profession d'avocat" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Qui suis-je ?
          </h1>

          {/* Portrait and Bio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="flex justify-center items-start">
              <img
                src={portraitImage}
                alt="Portrait d'Inès"
                className="rounded-2xl shadow-xl w-full max-w-md object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Juriste diplômée d'Assas et de l'EFB, spécialisée en cybersécurité et intelligence économique.
              </p>
              <p className="text-lg leading-relaxed">
                Mon objectif : rendre le droit accessible à tous grâce à des outils concrets et des explications simples.
              </p>
              <p className="text-lg leading-relaxed">
                Je partage mes connaissances pour que chacun puisse comprendre ses droits et agir en toute autonomie.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-secondary rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Mon parcours en bref
            </h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-accent mt-2"></div>
                  <div className="flex-grow border-l-2 border-border pl-6 pb-6 last:border-l-0 last:pb-0">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APropos;
