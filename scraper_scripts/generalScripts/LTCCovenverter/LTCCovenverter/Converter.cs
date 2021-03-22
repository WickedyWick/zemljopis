using System;
using System.Collections.Generic;
using System.Text;

namespace LTCCovenverter
{
    class Converter
    {
        public static Dictionary<string, char> tabela = new Dictionary<string, char>()
            {
                {"A",'А'},
                {"B",'Б'},
                {"V",'В'},
                {"G",'Г'},
                {"D",'Д'},
                {"Đ",'Ђ'},
                {"E",'Е'},
                {"Ž",'Ж'},
                {"Z",'З'},
                {"I",'И'},
                {"J",'Ј'},
                {"K",'К'},
                {"L",'Л'},
                {"Lj",'Љ'},
                {"M",'М'},
                {"N",'Н'},
                {"Nj",'Њ'},
                {"O",'О'},
                {"P",'П'},
                {"R",'Р'},
                {"S",'С'},
                {"T",'Т'},
                {"Ć",'Ћ'},
                {"U",'У'},
                {"F",'Ф'},
                {"H",'Х'},
                {"C",'Ц'},
                {"Č",'Ч'},
                {"Dž",'Џ'},
                {"Š",'Ш'},
                {"a",'а'},
                {"b",'б'},
                {"v",'в'},
                {"g",'г'},
                {"d",'д'},
                {"đ",'ђ'},
                {"e",'е'},
                {"ž",'ж'},
                {"z",'з'},
                {"i",'и'},
                {"j",'ј'},
                {"k",'к'},
                {"l",'л'},
                {"lj",'љ'},
                {"m",'м'},
                {"n",'н'},
                {"nj",'њ'},
                {"o",'о'},
                {"p",'п'},
                {"r",'р'},
                {"s",'с'},
                {"t",'т'},
                {"ć",'ћ'},
                {"u",'у'},
                {"f",'ф'},
                {"h",'х'},
                {"c",'ц'},
                {"č",'ч'},
                {"dž",'џ'},
                {"š",'ш'},
                {" ",' '}
            };

        public static string ConvertIt(string latinica)
        {
            StringBuilder cirilica = new StringBuilder("");
            try
            {
                for (int i = 0; i < latinica.Length; i++)
                {
                    if (latinica[i] == 'D' || latinica[i] == 'd' || latinica[i] == 'n' || latinica[i] == 'N' || latinica[i] == 'L' || latinica[i] == 'l')
                    {
                        if (i < latinica.Length - 1)
                        {
                            //this part is nor working propertly
                            switch (latinica[i])
                            {
                                case 'D':
                                    if (latinica[i + 1] == 'ž')
                                    {
                                        cirilica.Append(tabela["Dž"]);
                                        i++;
                                    }
                                    else
                                        cirilica.Append(tabela[latinica[i].ToString()]);
                                    break;
                                case 'd':
                                    if (latinica[i + 1] == 'ž')
                                    {
                                        cirilica.Append(tabela["dž"]);
                                        i++;
                                    }
                                    else
                                        cirilica.Append(tabela[latinica[i].ToString()]);
                                    break;
                                case 'N':
                                    
                                    if (latinica[i + 1] == 'j')
                                    {
                                        cirilica.Append(tabela["Nj"]);
                                        i++;
                                    }
                                    else
                                        cirilica.Append(tabela[latinica[i].ToString()]);
                                    break;
                                case 'n':

                                    if (latinica[i + 1] == 'j')
                                    {
                                        cirilica.Append(tabela["nj"]);
                                        i++;
                                    }
                                    else
                                        cirilica.Append(tabela[latinica[i].ToString()]);
                                    break;
                                case 'L':
                                    if (latinica[i + 1] == 'j')
                                    {
                                        cirilica.Append(tabela["Lj"]);
                                        i++;
                                    }
                                    else
                                        cirilica.Append(tabela[latinica[i].ToString()]);
                                    break;
                                case 'l':
                                    if (latinica[i + 1] == 'j')
                                    {
                                        i++;
                                        cirilica.Append(tabela["lj"]);
                                    }
                                    else
                                        cirilica.Append(tabela[latinica[i].ToString()]);
                                    break;
                                default:

                                    break;
                            }
                        }
                        else
                            cirilica.Append(tabela[latinica[i].ToString()]);

                    }
                    else
                        cirilica.Append(tabela[latinica[i].ToString()]);
                }

                return cirilica.ToString();
            }
            catch
            {
                return null;
            }


        }
    }
}
