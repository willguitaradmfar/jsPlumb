#!/bin/bash --norc
#
# Convertendo bases numéricas.
#
# Sandro Marcell (sandro_marcell@yahoo.com.br)
#
# Obs.: São necessários o dialog e a calculadora bc.
 
# Mensagens 'piscantes'! =)
Echo() { echo -e "\e[1;5m$*\e[m" ; }
 
# Programas necessários:
[[ $(which dialog) ]] || { Echo "É necessário o dialog."; exit 1; }
[[ $(which bc) ]] || { Echo "É necessária a calculadora BC."; exit 1; }
 
# Título do script:
TT="Conversor.sh - Convertendo valores em diferentes bases numéricas."
 
# Laço principal:
while :
do
   # Menu na tela:
   OPC=$(dialog --stdout --no-cancel --backtitle "$TT" --radiolist   \
   "Escolha uma opção: *Pressione <ESC> para sair." 0 0 0     \
   "1" "Converter decimal para binário, octal e hexadecimal" ON   \
   "2" "Converter hexadecimal para binário, octal e decimal" OFF   \
   "3" "Converter binário para octal, decimal e hexadecimal" OFF   \
   "4" "Converter octal para binário, decimal e hexadecimal" OFF   \
   --and-widget --no-cancel --inputbox "Digite o valor:" 0 0       )
    
   # <ESC> sai do script:
   [[ $? == 255 ]] && break
    
   # Capturando a opção escolhida (1-4):
   IND=${OPC::1}
   # Capturando o valor digitado (na base 16 tudo é maiúsculo):
   VLR=$(echo ${OPC:1} | tr "a-f" "A-F")
 
   # Se nenhum valor for especificado:
   [[ $VLR ]] || {
   Echo "-> Especifique um valor."
   read -n 1 && continue ; }
 
   # Iniciando conversões:
   case $IND in
      1) # Conversão de decimal.
      # Base 10 somente 0-9:
      grep -qs "[^0-9]" <(echo "$VLR")
      [[ $? == 0 ]] && {
      Echo "-> Na base 10 use de 0-9"
      read -n 1 && continue ; }
 
      # Convertendo...
      B=$(bc -l <<< "obase = 2 ; ibase = 10 ; $VLR")
      O=$(bc -l <<< "obase = 8 ; ibase = 10 ; $VLR")
      H=$(bc -l <<< "obase = 16; ibase = 10 ; $VLR")
 
      # Resultado:
      dialog --backtitle "$TT" --no-cancel\
      --title "Resultado ($VLR):" --msgbox "\
      Binário     = $B\n\
      Octal       = $O\n\
      Hexadecimal = $H" 0 0
      ;;
 
      2) # Conversão de hexadecimal
      grep -qs "[^0-9A-F]" <(echo "$VLR")
      [[ $? == 0 ]] && {
      Echo "-> Na base 16 use de 0-9 e A-F"
      read -n 1 && continue ; }
 
      B=$(bc -l <<< "obase = 2 ; ibase = 16 ; $VLR")
      O=$(bc -l <<< "obase = 8 ; ibase = 16 ; $VLR")
      D=$(bc -l <<< "obase = 10; ibase = 16 ; $VLR")
 
      dialog --backtitle "$TT" --no-cancel\
      --title "Resultado ($VLR):" --msgbox "\
      Binário = $B\n\
      Octal   = $O\n\
      Decimal = $D" 0 0
      ;;
 
      3) # Conversão de binário
      grep -qs "[^0-1]" <(echo "$VLR")
      [[ $? == 0 ]] && {
      Echo "-> Na base 2 use de 0-1"
      read -n 1 && continue ; }
 
      O=$(bc -l <<< "obase = 8 ; ibase = 2 ; $VLR")
      D=$(bc -l <<< "obase = 10; ibase = 2 ; $VLR")
      H=$(bc -l <<< "obase = 16; ibase = 2 ; $VLR")
 
      dialog --backtitle "$TT" --no-cancel\
      --title "Resultado ($VLR):" --msgbox "\
      Octal       = $O\n\
      Decimal     = $D\n\
      Hexadecimal = $H" 0 0
      ;;
 
      4) # Conversão de octal
      grep -qs "[^0-7]" <(echo "$VLR")
      [[ $? == 0 ]] && {
      Echo "-> Na base 8 use de 0-7"
      read -n 1 && continue ; }
 
      B=$(bc -l <<< "obase = 2 ; ibase = 8 ; $VLR")
      D=$(bc -l <<< "obase = 10; ibase = 8 ; $VLR")
      H=$(bc -l <<< "obase = 16; ibase = 8 ; $VLR")
 
      dialog --backtitle "$TT" --no-cancel\
      --title "Resultado ($VLR):" --msgbox "\
      Binário     = $B\n\
      Decimal     = $D\n\
      Hexadecimal = $H" 0 0
      ;;
 
      *) break
   esac
done
# Fim