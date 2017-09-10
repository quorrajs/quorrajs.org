(function() {
    var algolia_app_id = 'ISMCF9C8C9';
    var algolia_search_key = 'db95d1d6ede676e8ee75bd916f49e64b';
    var version = '1.0.0';

    var client = algoliasearch(algolia_app_id, algolia_search_key);
    var index = client.initIndex('docs');

    var templates = {
        suggestion: Hogan.compile($('#search_suggestion_template').html()),
        empty: Hogan.compile($('#search_empty_template').html()),
        footer: Hogan.compile($('#search_footer_template').html())
    };
    var $searchInput = $('#search input');
    var $article = $('article.post');


    var datasets = [];

    datasets.push({
        source: function searchAlgolia(query, cb) {
            index.search(query, {
                hitsPerPage: 5, tagFilters: [version]
            }, function searchCallback(err, content) {
                if (err) {
                    throw err;
                }
                cb(content.hits)
            });
        },
        templates: {
            suggestion: templates.suggestion.render.bind(templates.suggestion),
            empty: templates.empty.render.bind(templates.empty),
            footer: templates.footer.render.bind(templates.footer)
        }
    });

    var typeahead = $searchInput.typeahead({hint: false}, datasets);
    var old_input = '';

    typeahead.on('typeahead:selected', function changePage(e, item) {
        window.location.href = '/docs/' + item._tags[0] + '/' + item.link;
    });

    typeahead.on('keyup', function (e) {
        old_input = $(this).typeahead('val');

        if ($(this).val() === '' && old_input.length == $(this).typeahead('val')) {
            $article.css('opacity', '1');
        } else {
            $article.css('opacity', '0.1');
        }
        if (e.keyCode === 27) {
            $article.css('opacity', '1');
        }
    });

    typeahead.on('typeahead:closed', function () {
        $article.css('opacity', '1');
    });

    typeahead.on('typeahead:closed',
        function (e) {
            // keep menu open if input element is still focused
            if ($(e.target).is(':focus')) {
                return false;
            }
        }
    );

    var closeEvent = 'touchstart';
    var navActive = false;
    if (!('ontouchstart' in window)) {
        closeEvent = 'click';
    }
    $('.navbar-toggle').on('click', openNav);
    $('#overlay').on(closeEvent, closeNav);

    /** side navigation **/
    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
    function openNav() {
        if(!navActive) {
            navActive = true;
            document.getElementById("overlay").style.display = "block";
            document.getElementById("sidenav").style.width = "70%";
            document.getElementById('main-content').style.marginLeft = "70%";
        }
    }

    /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
    function closeNav() {
        if(navActive) {
            navActive = false;
            document.getElementById("overlay").style.display = "none";
            document.getElementById("sidenav").style.width = "0";
            document.getElementById('main-content').style.marginLeft = "0";
        }
    }
})();