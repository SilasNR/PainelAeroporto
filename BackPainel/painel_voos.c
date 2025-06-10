#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Voo
{
    int voo;
    char companhia[50];
    char destino[50];
    char portao[10];
    char hora[6]; /* Formato: HH:MM */
    char observacao[50];
    struct Voo *prox;
} Voo;

int compararHora(const char *h1, const char *h2)
{
    int hh1, mm1, hh2, mm2;
    sscanf(h1, "%d:%d", &hh1, &mm1);
    sscanf(h2, "%d:%d", &hh2, &mm2);
    if (hh1 != hh2)
        return hh1 - hh2;
    return mm1 - mm2;
}

void inserirVoo(Voo **lista, Voo *novo)
{
    if (*lista == NULL || compararHora(novo->hora, (*lista)->hora) < 0)
    {
        novo->prox = *lista;
        *lista = novo;
        return;
    }
    Voo *atual = *lista;
    while (atual->prox != NULL && compararHora(novo->hora, atual->prox->hora) >= 0)
    {
        atual = atual->prox;
    }
    novo->prox = atual->prox;
    atual->prox = novo;
}

void listarVoos(Voo *lista)
{
    if (lista == NULL)
    {
        printf("[]\n");
        return;
    }

    printf("[\n");
    while (lista != NULL)
    {
        printf("  {\"voo\": %d, \"companhia\": \"%s\", \"destino\": \"%s\", \"portao\": \"%s\", \"hora\": \"%s\", \"observacao\": \"%s\"}",
               lista->voo, lista->companhia, lista->destino, lista->portao, lista->hora, lista->observacao);

        if (lista->prox != NULL)
            printf(",\n");
        else
            printf("\n");

        lista = lista->prox;
    }
    printf("]\n");
}

Voo *buscarVoo(Voo *lista, int numero)
{
    while (lista != NULL)
    {
        if (lista->voo == numero)
            return lista;
        lista = lista->prox;
    }
    return NULL;
}

void alterarVoo(Voo *v)
{
    if (v == NULL)
    {
        printf("Voo não encontrado.\n");
        return;
    }
    printf("Alterando informações do voo %d:\n", v->voo);
    printf("Nova companhia: ");
    scanf(" %[^\n]", v->companhia);
    printf("Novo destino: ");
    scanf(" %[^\n]", v->destino);
    printf("Novo portão: ");
    scanf(" %[^\n]", v->portao);
    printf("Nova hora (HH:MM): ");
    scanf(" %5[^\n]", v->hora);
    printf("Nova observação: ");
    scanf(" %[^\n]", v->observacao);
}

void removerVoo(Voo **lista, int numero)
{
    Voo *atual = *lista, *anterior = NULL;
    while (atual != NULL && atual->voo != numero)
    {
        anterior = atual;
        atual = atual->prox;
    }
    if (atual == NULL)
    {
        printf("Voo não encontrado.\n");
        return;
    }
    if (anterior == NULL)
    {
        *lista = atual->prox;
    }
    else
    {
        anterior->prox = atual->prox;
    }
    free(atual);
    printf("Voo removido com sucesso.\n");
}

Voo *criarVoo()
{
    Voo *novo = (Voo *)malloc(sizeof(Voo));
    if (!novo)
    {
        printf("Erro ao alocar memória.\n");
        exit(1);
    }
    printf("Número do voo: ");
    scanf("%d", &novo->voo);
    printf("Companhia: ");
    scanf(" %[^\n]", novo->companhia);
    printf("Destino: ");
    scanf(" %[^\n]", novo->destino);
    printf("Portão: ");
    scanf(" %[^\n]", novo->portao);
    printf("Hora (HH:MM): ");
    scanf(" %5[^\n]", novo->hora);
    printf("Observação: ");
    scanf(" %[^\n]", novo->observacao);
    novo->prox = NULL;
    return novo;
}

void salvarVoos(Voo *lista)
{
    FILE *f = fopen("voos.dat", "wb");
    if (!f)
    {
        perror("Erro ao abrir o arquivo para escrita");
        return;
    }

    Voo *atual = lista;
    while (atual != NULL)
    {
        fwrite(atual, sizeof(Voo), 1, f);
        atual = atual->prox;
    }

    fclose(f);
    printf("Voos salvos em voos.dat\n");
}

void carregarVoos(Voo **lista)
{
    FILE *f = fopen("voos.dat", "rb");
    if (!f)
    {
        printf("Arquivo voos.dat não encontrado. Iniciando lista vazia.\n");
        return;
    }

    Voo temp;
    while (fread(&temp, sizeof(Voo), 1, f))
    {
        Voo *novo = (Voo *)malloc(sizeof(Voo));
        if (!novo)
        {
            printf("Erro ao alocar memória.\n");
            fclose(f);
            return;
        }
        *novo = temp;
        novo->prox = NULL;
        inserirVoo(lista, novo);
    }

    fclose(f);
    printf("Voos carregados de voos.dat\n");
}

int main()
{
    Voo *lista = NULL;
    int opcao, numVoo;

    carregarVoos(&lista); // <- carrega do arquivo ao iniciar

    while (1)
    {
        scanf("%d", &opcao);

        switch (opcao)
        {
        case 1:
        {
            Voo *novo = criarVoo();
            inserirVoo(&lista, novo);
            printf("Voo inserido com sucesso!\n");
            break;
        }
        case 2:
            listarVoos(lista);
            break;
        case 3:
            printf("Informe o número do voo para alterar: ");
            scanf("%d", &numVoo);
            {
                Voo *vAlterar = buscarVoo(lista, numVoo);
                if (vAlterar != NULL)
                {
                    removerVoo(&lista, numVoo);
                    Voo *novo = criarVoo(); // reaproveita a função já existente
                    inserirVoo(&lista, novo);
                    printf("Voo alterado com sucesso!\n");
                }
                else
                {
                    printf("Voo não encontrado.\n");
                }
            }
            break;
        case 4:
            printf("Informe o número do voo para remover: ");
            scanf("%d", &numVoo);
            removerVoo(&lista, numVoo);
            break;
        case 5:
            salvarVoos(lista); // <- salva no arquivo antes de sair
            // liberar memória
            while (lista != NULL)
            {
                Voo *temp = lista;
                lista = lista->prox;
                free(temp);
            }
            printf("Saindo...\n");
            return 0;
        }
    }
}
