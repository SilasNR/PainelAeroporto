#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

typedef struct Flight {
    struct Flight* previous;  // corrigido
    char origem[20];
    char destino[20];
    char numero[10];
    char data[11];
    char hora[6];
    char companhia[20];
    char tipo[20];
    char status[20];
    struct Flight* next;      // corrigido
} Flight;

Flight* generateAddress(char origem[20], char destino[20], char numero[10], char data[11], char hora[6], char companhia[20], char tipo[20], char status[20]) {
    Flight* newFlight = (Flight*) malloc(sizeof(Flight));
    if (newFlight == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
    }
    strcpy(newFlight->origem, origem);
    strcpy(newFlight->destino, destino);
    strcpy(newFlight->numero, numero);
    strcpy(newFlight->data, data);
    strcpy(newFlight->hora, hora);
    strcpy(newFlight->companhia, companhia);
    strcpy(newFlight->tipo, tipo);
    strcpy(newFlight->status, status);
    newFlight->previous = NULL;
    newFlight->next = NULL;
    return newFlight;
}

int main()
{
    int opcao = -1;
    char origem[20];
    char destino[20];
    char numero[10];
    char data[11]; // Formato: YYYY-MM-DD
    char hora[6];  // Formato: HH:MM
    char companhia[20];
    char tipo[20]; // "Econômico", "Primeira Classe"
    char status[20]; // "Aguardando Embarque", "Atrasado", "Cancelado"
    Flight* start = NULL;
    Flight* end = NULL;

    while( opcao != 0){
        printf( "\n\n------Menu------\n");
        printf( " 1 - Inserir novo voo na lista \n");
        printf( " 2 - Remover voo da lista \n");
        printf( " 3 - Mudar status do voo \n");
        printf( " 4 - Mostrar o terminal \n");
        printf( " 0 - Sair \n");
        printf( " Digite sua escolha:  ");
        scanf( "%d" , &opcao );


        if( opcao == 1 ){
            printf( " Digite a origem do novo voo:  ");
            scanf( " %[^\n]" , origem );

            printf( " Digite o destino do novo voo:  ");
            scanf( " %[^\n]" , destino );

            printf( " Digite o numero do novo voo:  ");
            scanf( " %[^\n]" , numero );

            printf( " Digite a data do novo voo (YYYY-MM-DD):  ");
            scanf( " %[^\n]" , data );

            printf( " Digite a hora do novo voo (HH:MM):  ");
            scanf( " %[^\n]" , hora );

            printf( " Digite a companhia do novo voo:  ");
            scanf( " %[^\n]" , companhia );

            printf( " Digite o tipo do novo voo (Econômico/Primeira Classe):  ");
            scanf( " %[^\n]" , tipo );

            printf( " Digite o status do novo voo (Aguardando Embarque/Atrasado/Cancelado):  ");
            scanf( " %[^\n]" , status );

            Flight* newFlight = generateAddress(origem, destino, numero, data, hora, companhia, tipo, status);

            if (newFlight != NULL)  {
                if (start == NULL) {
                    start = newFlight;
                    end = newFlight;
                }   else {
                    // Os voos devem ser ordenados por hora, de modo que os voos mais cedo venham primeiro e os mais tarde venham por último.
                    if (strcmp(hora, start->hora) < 0) {
                        // Colocando o voo no Início da lista
                        newFlight->next = start;
                        start->previous = newFlight;
                        start = newFlight;
                    }
                }
            }
        }
    }

    return 0;
}
