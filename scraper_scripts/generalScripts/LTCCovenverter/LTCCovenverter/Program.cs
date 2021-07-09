using System;
using System.IO;

namespace LTCCovenverter
{
    class Program
    {
        static void Main(string[] args)
        {
            int num;
            string[] data;
            string correct;
            string letter;
            string kat;
            string[] lines;
            string input;
            string output;
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            //za sada potrebni full pathovi
            try
            {
                //add mode

                input = args[0];
                output = args[1];
                string mode = args[2];
                if(mode == "NORMAL"){
                    lines = System.IO.File.ReadAllLines(@$"{input}");
                    using (StreamWriter writer = new StreamWriter(@$"{output}"))
                    {
                        for (int i = 0; i < lines.Length; i++)
                        {
                            data = lines[i].Split('|');
                            correct = data[0];
                            letter = data[data.Length - 1];
                            string cirilica = Converter.ConvertIt(correct);
                            string newD = "";
                            for (int j = 0; j < data.Length - 1; j++)
                            {
                                newD += $"{data[j]}|";
                            }
                            newD += $"{cirilica}|{letter}";
                            writer.WriteLine(newD);
                        }
                    }
                }else if(mode == "PREDLOG"){
                    lines = System.IO.File.ReadAllLines(@$"{input}");
                    using (StreamWriter writer = new StreamWriter(@$"{output}"))
                    {
                        for (int i = 0; i < lines.Length; i++)
                        {
                            data = lines[i].Split('|');
                            correct = data[0];
                            letter = data[data.Length - 1];
                            kat = data[data.Length - 2];
                            string cirilica = Converter.ConvertIt(correct);
                            string newD = "";
                            for (int j = 0; j < data.Length - 2; j++)
                            {
                                newD += $"{data[j]}|";
                            }
                            newD += $"{cirilica}|{kat}|{letter}";
                            writer.WriteLine(newD);
                        }
                    }
                }
            }
            catch (IndexOutOfRangeException)
            {
                Console.WriteLine("Potrebna tri argumenta\n<FullInputPath> <FullOutputPath> <Mode>");
            }
            
            
            
           
        }
    }
}
