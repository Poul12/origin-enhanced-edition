const SUPABASE_URL = "https://wziijmhfcknespnvqodl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0diurq5vOJhLqOaT44FFMA_f71m0-Yr";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


const Analytics = {

    getPlayerId() {

        let playerId = localStorage.getItem("rpglooter_player_id");

        if (!playerId) {

            playerId = crypto.randomUUID();

            localStorage.setItem(
                "rpglooter_player_id",
                playerId
            );
        }

        return playerId;
    },


    async send(event, extra = {}) {

        try {

            const { error } = await supabaseClient
                .from("game_events")
                .insert({
                    event: event,

                    player_id: this.getPlayerId(),

                    character_name:
                        gameState?.char?.playerName || null,
                    
                    game_version:
                        typeof GAME_VERSION !== "undefined"
                            ? GAME_VERSION
                            : null,

                    platform:
                        window.Capacitor
                            ? "android"
                            : "web",

                    language:
                        navigator.language || null,

                    ...extra
                });


            if (error) {
                console.warn(
                    "[Analytics]",
                    error.message
                );
            }

        } catch (error) {

            console.warn(
                "[Analytics] Failed:",
                error
            );
        }
    },


    /*gameStarted() {
        return this.send("game_started");
    },*/
    
    gameStarted() {

      if (sessionStorage.getItem("analytics_game_started")) {
        return;
      }

      sessionStorage.setItem(
        "analytics_game_started",
        "1"
      );

      return this.send("game_started");
    },
    
    newGameCreated() {
        return this.send("new_game_created");
    }

};