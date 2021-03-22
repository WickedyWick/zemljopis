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
            string[] lines;
            string input;
            string output;
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            //za sada potrebni full pathovi
            try
            {
                input = args[0];
                output = args[1];
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
            }
            catch (IndexOutOfRangeException)
            {
                Console.WriteLine("Potrebna dva argumenta\n<FullInputPath> <FullOutputPath>");
            }
            
            Console.ReadKey();
            
           
        }
    }
}
