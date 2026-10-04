import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { soundManager } from "@/lib/soundEffects";
import mascot from "/mascot.png";
import { BookOpen, Sparkles, ChefHat, ArrowRight, Heart } from "lucide-react";
import { useRecipes } from "@/context/RecipeContext";

const Index = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { recipes } = useRecipes();
  const whatsappLink = `https://wa.me/919866812555`;

  // Showcase 3 top recipes in teaser
  const spotlightRecipes = recipes.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-950/5 to-background flex flex-col font-sans">
      {/* Top Header / Bar */}
      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2.5"
            onClick={() => soundManager.playClick()}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900/10 text-amber-900 border border-amber-800/20 shadow-xs">
              <span className="text-lg">🍫</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-amber-950 dark:text-amber-100">
              ChocoFarms
            </span>
          </Link>

          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-amber-900/20 text-xs font-semibold gap-1.5 hover:bg-amber-900/10 text-amber-950 dark:text-amber-200"
              onClick={() => soundManager.playClick()}
            >
              <Link to="/cook">
                <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                <span>{t.nav.cookbook}</span>
              </Link>
            </Button>

            <button
              onClick={() => {
                toggleLang();
                soundManager.playChime(520);
              }}
              className="rounded-full border border-amber-900/20 bg-amber-50/80 px-2.5 py-1 text-xs font-semibold text-amber-900 transition-all hover:bg-amber-100"
              title="Toggle English / తెలుగు"
            >
              {lang === "en" ? "తెలుగు" : "English"}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-16 flex-1 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/10 px-4 py-1 text-xs font-semibold text-amber-900 dark:text-amber-300 animate-in fade-in duration-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>{lang === "te" ? "ప్రకృతి & తియ్యని సాహసాల సంగమం" : "Agro-Resorts & Cocoa Sanctuary"}</span>
          </div>

          {/* Headline */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              {lang === "te" ? (
                <>
                  ప్రకృతి ఒడిలో...
                  <span className="block text-primary mt-2">తియ్యనైన సాహసాలు</span>
                </>
              ) : (
                <>
                  Where Nature Meets
                  <span className="block text-primary mt-2">Sweet Adventures</span>
                </>
              )}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {lang === "te"
                ? "కోకో చెట్లు కథలు చెప్పే ప్రదేశం... నేల మీ ఆత్మను సేదదీర్చే వాతావరణం, ప్రతి క్షణం ఒక తియ్యటి అన్వేషణలా అనిపించే అద్భుతం."
                : "Imagine a place where cocoa trees whisper stories, where the earth feeds your soul, and every moment tastes like discovery..."}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-sm sm:text-base rounded-2xl px-6 py-6 shadow-lg hover:scale-103 transition-all gap-2"
              onClick={() => soundManager.playChime(660)}
            >
              <Link to="/cook">
                <ChefHat className="w-5 h-5 text-amber-300" />
                <span>{t.homeTeaser.button}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 font-semibold text-sm sm:text-base rounded-2xl px-6 py-6 transition-all hover:scale-103"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
                <span>{t.nav.notifyMe} (WhatsApp)</span>
              </a>
            </Button>
          </div>

          {/* Mascot */}
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 py-4">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl group-hover:blur-4xl transition-all" />
              <img
                src={mascot}
                alt="ChocoFarms Mascot"
                className="relative w-72 h-auto md:w-88 lg:w-[440px] drop-shadow-2xl mx-auto transition-transform duration-500 group-hover:scale-102"
              />
            </div>
          </div>

          {/* Farm Cookbook Spotlight Feature Section */}
          <div className="w-full text-left space-y-5 pt-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-250">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/70 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  {t.homeTeaser.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {t.homeTeaser.title}
                </h2>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-amber-900 hover:text-amber-950 dark:text-amber-200 font-semibold text-xs gap-1 self-start sm:self-auto"
                onClick={() => soundManager.playClick()}
              >
                <Link to="/cook">
                  <span>{t.homeTeaser.browseRecipes}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground max-w-2xl">
              {t.homeTeaser.description}
            </p>

            {/* Spotlight Recipes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {spotlightRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/cook/${recipe.id}`}
                  onClick={() => soundManager.playClick()}
                  className="group rounded-3xl border border-amber-900/15 bg-card/80 p-3.5 hover:border-amber-900/30 hover:shadow-lg transition-all flex flex-col space-y-3"
                >
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={recipe.image}
                      alt={recipe.title[lang]}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                        {recipe.categoryLabel[lang]}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-amber-900 transition-colors line-clamp-1">
                      {recipe.title[lang]}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {recipe.tagline[lang]}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-300 font-semibold border-t border-border/50">
                    <span>{recipe.totalTimeMinutes} {t.recipeCard.mins}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t.recipeCard.viewRecipe} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mystery Box Resort Preview */}
          <div className="w-full bg-card/60 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-10 space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 shadow-md text-center mt-6">
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-2xl">🌱🏡🍫</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {lang === "te"
                  ? "ఆగ్రో-రిసార్ట్స్ & కోకో అనుభూతి"
                  : "Something Special is Growing"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {lang === "te"
                  ? "పచ్చని గ్రామీణ ప్రకృతి మరియు స్వచ్ఛమైన ఫామ్ జీవితపు ప్రశాంతతను అందించే ఆగ్రో-రిసార్ట్. త్వరలోనే మీ ముందుకు..."
                  : "An experience that blends the tranquility of nature with the richness of authentic farm life. Stay tuned for the reveal."}
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl transition-all hover:scale-105"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                {lang === "te" ? "వాట్సాప్‌లో నోటిఫై చేయండి" : "Notify Me on WhatsApp"}
              </a>
            </Button>
          </div>

          {/* Footer Hint */}
          <p className="text-xs text-muted-foreground/70 animate-in fade-in duration-700 delay-500 pt-6">
            🌱 ChocoFarms | Agro-Resorts & Cocoa Fun | Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
