$(document).ready(function(){
	loadPicker();
    loadFonts("AIzaSyCoziaVAsAhQjoDwkVAHnNqEo1Hyur-Xng");
    loadDogs();
	loadAllDogs();
	loadHistoryDogs();
    textAnimate();
	$(document).on('change', '#myDog', function(){
        loadImageDogs(this);
    });
    $(".content__dog-history").click(function(){
        $(".content__dog-resulted").toggleClass("open");
    });
    $(document).scroll(function () {
        wWidth = $(window).width();
        if (wWidth <= 980) {
            scroll_max = 1;
        } else {
            scroll_max = 100;
        }
        scroll = $(window).scrollTop();

        if (scroll >= scroll_max) {
            $('header').addClass('active');
        } else {
            $('header').removeClass('active');
        }
    });

	$("#myFont").change(function() {
        changeFontBySelect(this);
    });
    $(".reset_button").click(function() {
        resetDogForm();
    });
    

    $(".save__dog").click(function() {
        var nameDog = $(".dogname").val()
        var typeDog = $("#myDog").val()
        var fontDog = $("#myFont").val()
        var imageDog = $(".content__dog-image").attr("src");
        var colorFontDog = $("#colorpicker").spectrum("get").toHexString();
        var updateIndex = $(this).attr("data-index");
        
        if (nameDog && typeDog && $(this).attr("data-update") != "true") {
            saveNewDog(nameDog, typeDog, fontDog, imageDog, colorFontDog);
        }  else if ($(this).attr("data-update") == "true") {
            saveNewDog(nameDog, typeDog, fontDog, imageDog, colorFontDog, updateIndex);
        } else {
            $(".save__msg-error").addClass("save__msg-error--visible")

            setTimeout(function() {
                $(".save__msg-error").removeClass("save__msg-error--visible")
            }, 3000);
        }
    })

	

});

function loadPicker() {
    $("#colorpicker").spectrum({
        showPalette: true,
        palette: [
            ['black', 'red', 'blue', "purple", "green"],
        ],
        color: "#000",
        preferredFormat: "hex",
        change: function(color) {
            change_color(color);
        }
    });
}

function loadFonts(apiKey) {
    $.ajax({
        url: "https://www.googleapis.com/webfonts/v1/webfonts?key=" + apiKey,
        success: function(success) {
            // Populate fonts select input
            $.each(success.items, function (fonts, font) {
                let fontItem = '<option value="' + font.files.regular + '">' + font.family + '</option>';
                $("#myFont").append(fontItem);
            });
        }
    });
}

function loadAllDogs() {
    $.ajax({
        url: "https://dog.ceo/api/breeds/list/all",
        success: function (result) {
            var breeds = result.message;

            $.each(breeds, function (dog, breed) {
                // Populate Sub Breeds
                if (breeds[dog].length >= 1) {
                    for (i = 0; i < breeds[dog].length; i++) {
                        $("#myDog").append('<option value="' + dog + '-' + breeds[dog][i] + '">' + breeds[dog][i] + ' ' + dog + '</option>');
                    }
                }

                // Populate Parent Breeds
                else if (breeds[dog].length < 1) {
                    $("#myDog").append('<option value="' + dog + '">' + dog + '</option>');
                }
            });
        },
        error: function (result) {
            console.log("Error: " + result)
            $("#myDog").html('<option value="erro">Sorry, we got a problem :(</option>')
        }
    });
}

function loadDogs(){
    // Get Dogs from Local Storage and turn data into Objects
    var dogs = JSON.parse(localStorage.getItem("dogs"));

    if (!dogs) {
        $(".history__error-msg").fadeIn();
        return false;
    }

    if (dogs.length && typeof dogs !== 'undefined') {
        $(".history__error-msg").css("display", "none");

        // Remove old dogs to update
        $(".card__dog[data-index]").fadeIn(300);
        setTimeout(function() {
            $(".card__dog[data-index]").remove();
        }, 320);

        // Show all dogs in local storage
        setTimeout(function() {    
            $.each(dogs, function (index, dog) {
                historyDogClone = $(".card__dog--example").clone();
                historyDogClone.removeClass("card__dog--example")
                historyDogClone.attr("data-index", index);
                historyDogClone.css("opacity", "0");
                historyDogClone.find("img").attr("src", dog.image)
                historyDogClone.find("img").attr("dog-breed", dog.breed)
                historyDogClone.find(".nome_dog-clone").text(dog.name)
                historyDogClone.find(".nome_dog-clone").attr("data-color", dog.color)
                historyDogClone.find(".nome_dog-clone").attr("data-font", dog.font)

                if (dog.breed.indexOf("-") !== -1) {
                    console.log("1" + dog.breed)
                    dog.breed = dog.breed.split("-");
                    console.log("2" + dog.breed)
                    historyDogClone.find(".nome_dog-clone").text(dog.breed[0] + " " + dog.breed[1])
                }

                // Show items in fade effect
                $(".card__dog-history").append(historyDogClone);
                setTimeout(function() {
                    $(".card__dog[data-index='" + index + "']").css("opacity", "1");                
                }, 550 * index);
            })
        }, 350);
    } else {
        $(".history__error-msg").fadeIn();
    }
}

function loadHistoryDogs(){
    var dogs = JSON.parse(localStorage.getItem("mydogs"));

    if (!dogs) {
        $(".history__error-msg").fadeIn();
        return false;
    }

    if (dogs.length && typeof dogs !== 'undefined') {
        $(".history__error-msg").css("display", "none");

        // Remove old dogs to update
        $(".card__dog[data-index]").fadeIn(300);
        setTimeout(function() {
            $(".card__dog[data-index]").remove();
        }, 320);

        // Show all dogs in local storage
        setTimeout(function() {    
            $.each(dogs, function (index, dog) {
                historyDogClone = $(".card__dog--example").clone();
                historyDogClone.removeClass("card__dog--example")
                historyDogClone.attr("data-index", index);
                historyDogClone.css("opacity", "0");
                historyDogClone.find("img").attr("src", dog.image)
                historyDogClone.find("img").attr("dog-breed", dog.breed)
                historyDogClone.find(".nome_dog-clone").text(dog.name)
                historyDogClone.find(".nome_dog-clone").attr("data-color", dog.color)
                historyDogClone.find(".nome_dog-clone").attr("data-font", dog.font)

                if (dog.breed.indexOf("-") !== -1) {
                    console.log("1" + dog.breed)
                    dog.breed = dog.breed.split("-");
                    console.log("2" + dog.breed)
                    historyDogClone.find(".nome_dog-clone").text(dog.breed[0] + " " + dog.breed[1])
                }

                // Show items in fade effect
                $(".card__dog-history").append(historyDogClone);
                setTimeout(function() {
                    $(".card__dog[data-index='" + index + "']").css("opacity", "1");                
                }, 550 * index);
            })
        }, 350);
    } else {
        $(".history__error-msg").fadeIn();
    }
}

function loadImageDogs(item) {
    if($(".searchdogs__button").attr("data-update") != "true") {
        selectedDog = $(item).val().replace('-', '/');
    
        $.getJSON("https://dog.ceo/api/breed/" + selectedDog + "/images/random", function(result) {

            // Fade Effect on Image Change
		$(".content__dog-image").css({"opacity": 0, "left": "100%"})
            $(".content__dog-image").attr("src", result.message);
            $(".content__dog-image").attr("alt", selectedDog);
            setTimeout(function() {
                $(".content__dog-image").css({"opacity": 1, "left": "50%"})
            }, 1000);
        })
        .error(function(result) {
            console.log("Error: " + result)
            $(".content__dog-image").attr("src", "assets/images/error-dog.png");
        })
    }
}

function getOldDog(dog) {
    dog_name = $(dog).parents(".card__dog").find(".nome_dog").text();
    dog_font = $(dog).parents(".card__dog").find(".nome_dog").attr("data-font");
    dog_color = $(dog).parents(".card__dog").find(".nome_dog").attr("data-color");
    dog_image = $(dog).parents(".card__dog").find("img").attr("src");
    dog_breed = $(dog).parents(".card__dog").find("img").attr("dog-breed");
    dog_index = $(dog).parents(".card__dog").attr("data-index");
    
    $(".searchdogs__button").attr("data-update", "true").attr("data-index", dog_index);
    $("#searchdogs-select").val(dog_breed);
    $("#searchdogs-fonts").val(dog_font).change();
    $("#colorpicker").spectrum("set", dog_color);
    change_color(dog_color);
    $(".nome_dog").val(dog_name);
    $(".searchdogs__dogimage").attr("src", dog_image);
}

function changeColor(name_color) {
    $(".nome_dog").css("color", name_color)
}

function changeFontBySelect(item) {
    new_font_src = $(item).find("option:selected").val();
    new_font_name = $(item).find("option:selected").text();
    new_font = new FontFace(new_font_name, 'url(' + new_font_src + ')');
    new_font.load().then(function(loaded_face) {
        document.fonts.add(loaded_face)
    }).catch(function(error) {});

    $(".nome_dog").css("font-family", new_font_name);
}

function resetDogForm() {
    $(".save__dog").attr("data-update", "true").removeAttr("data-index");
    $("#myDog").val("default");
    $("#myFont").val("default");
    $("#colorpicker").spectrum("set", "#000");
    change_color("#000");
    $(".dogname").val("").removeAttr("style");
    $(".nome_dog").text("");
    $(".content__dog-image").attr("src", "assets/images/retriever.png");
}

function textAnimate(){
	$('.dogname').keyup(function(){
		var nameDog = $(this).val();
		$('.nome_dog').text(nameDog);
	});
}

/**
 * @function
 * @description Add new dog to Local Storage Object
 * @param {string} newNameDog 
 * @param {string} newTypeDog
 * @param {string} newFontDog
 * @param {string} newImageDog
 * @param {string} newColorFontDog 
 */
function saveNewDog(newNameDog, newTypeDog, newFontDog, newImageDog, newColorFontDog) {
    var dogs = localStorage.getItem("dogs");

    if (!dogs) {
        new_dog = {};
        dogs = [];
        
        new_dog = {
            name: newNameDog,
            breed: newTypeDog,
            font: newFontDog,
            color: newColorFontDog,
            image: newImageDog
        }

        dogs.push(new_dog);

        localStorage.setItem("dogs", JSON.stringify(dogs))

        // Load dogs on add dog
        loadDogs();

        // Reset Form
        resetDogForm()
    } else {
        new_dog = {};
        dogs = JSON.parse(dogs)
        
        new_dog = {
            name: newNameDog,
            breed: newTypeDog,
            font: newFontDog,
            color: newColorFontDog,
            image: newImageDog
        }

        dogs.push(new_dog)
        localStorage.setItem("dogs", JSON.stringify(dogs))

        // Load dogs on add dog
        loadDogs();

        // Reset Form
        resetDogForm();
    }
}
