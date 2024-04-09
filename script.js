document.addEventListener('DOMContentLoaded', function() {
    let color_text = "";
    let first_time = true;
    let error_resolution = false;

    const container_enter = document.getElementById("container_enter");
    const enter_button = document.getElementById("enter_button");

    const music = document.getElementById("music");
    music.preload = "auto";

    function check_resolution() {
        if (window.innerWidth < 1700 || window.innerHeight < 850) {
            document.getElementById("screen").classList.add("hidden")
            document.getElementById("resolution_error_container").classList.remove("hidden")
            document.body.style.backgroundColor = "#000";
            error_resolution = true;
        } else if (window.innerWidth > 1700 || window.innerHeight > 850) {
            document.getElementById("screen").classList.remove("hidden")
            document.getElementById("resolution_error_container").classList.add("hidden")
            if (color_text == "white" && !first_time) {
                document.body.style.backgroundColor = "#5c0300";
            } else if (color_text == "red" && !first_time) {
                document.body.style.backgroundColor = "#cecfcd";
            } else {
                first_time = false;
            }
            error_resolution = false;
        }
    }

    enter_button.addEventListener("click", function() {
        container_enter.style.display = "none";
        document.body.style.backgroundColor = "#cecfcd";

        music.play();

        const lyrics_container = document.getElementById("lyrics_container");
        color_text = "red";

        fetch('static/lyrics.json')
        .then(response => response.json())
        .then(data => {
            const sentences = data.sentences;
            let current_sentence_index = 0;

            function display_words() {
                const current_phrase = sentences[current_sentence_index];
                let total_delay = 0;

            
                current_phrase.words.forEach((current_word) => {
                    if (sentences[current_sentence_index + 1]) {
                        total_delay = current_word.time + sentences[current_sentence_index + 1].words[0].time;
                    } else {
                        total_delay = current_word.time
                    }

                    if (current_phrase.words.findIndex(word => word.text === current_word.text) != 0 || current_sentence_index == 0) {
                        setTimeout(() => {
                            let index = 0;

                            const show_interval = setInterval(() => {
                                if (index < current_word.text.length) {
                                    lyrics_container.textContent += current_word.text[index];
                                    index++;
                                } else {
                                    clearInterval(show_interval);
                                }
                            }, 15);
                        }, current_word.time);
                    } else {
                        let index = 0;

                        const show_interval = setInterval(() => {
                            if (index < current_word.text.length) {
                                lyrics_container.textContent += current_word.text[index];
                                index++;
                            } else {
                                clearInterval(show_interval);
                            }
                        }, 15);
                    }
                    
                    
                });

                setTimeout(() => {
                    current_sentence_index++;
                    if (current_sentence_index < sentences.length) {
                        lyrics_container.textContent = "";
                        if (color_text == "red" && !error_resolution) {
                            document.body.style.backgroundColor = "#5c0300";
                            lyrics_container.classList.remove("red");
                            lyrics_container.classList.add("white");
                            color_text = "white";
                        } else if (color_text == "white" && !error_resolution) {
                            document.body.style.backgroundColor = "#cecfcd";
                            lyrics_container.classList.remove("white");
                            lyrics_container.classList.add("red");
                            color_text = "red";
                        }
                        display_words();
                    } else {
                        setTimeout(() => {
                            document.body.style.backgroundColor = "#000";
                            container_enter.style.display = "block";
                            lyrics_container.textContent = "";
                            document.getElementById("enter_button").classList.add("hidden")
                            document.getElementById("credits").classList.remove("hidden")
                        }, 2000)
                    }
                }, total_delay);
            }


            display_words()

        })
        .catch(error => {
            console.error('Error loading JSON file containing lyrics', error);
        });
    });

    //check_resolution();

    window.addEventListener('resize', () => {check_resolution()}); 
});
