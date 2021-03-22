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
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            lines = System.IO.File.ReadAllLines(@"W:\TTM\scraper_scripts\drzave\newData.txt");
            using (StreamWriter writer = new StreamWriter(@"W:\TTM\scraper_scripts\drzave\dataCorrect.txt", true))
            {
                for(int i = 0; i < lines.Length; i++)
                {
                    data = lines[i].Split('|');
                    correct = data[0];
                    letter = data[data.Length - 1];
                    string cirilica = Converter.ConvertIt(correct);
                    string newD = "";
                    for(int j = 0; j < data.Length - 1; j++)
                    {
                        newD += $"{data[j]}|";
                    }
                    newD += $"{cirilica}|{letter}";
                    writer.WriteLine(newD);
                }
            }
        }
    }
}
