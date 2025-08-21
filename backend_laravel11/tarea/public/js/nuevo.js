$(document).ready(function() {
    $('#my-select').select2({
        ajax: {
            url: '/search-data',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    term: params.term // Término de búsqueda
                };
            },
            processResults: function (data) {
                console.log(data); // Verifica los datos en la consola
                return {
                    results: $.map(data, function (item) {
                        console.log(item); // Verifica cada item en la consola
                        return {
                            text: item.text,
                            id: item.id
                        }
                    })
                };
            },
            cache: true
        },
        placeholder: 'Seleccione una opción',
        minimumInputLength: 0    
       // minimumInputLength: 1 no iniciara lalista unicamnete cuando ingresa el texto   
    });
});





