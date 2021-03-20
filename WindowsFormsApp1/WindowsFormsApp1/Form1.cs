using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            num++;
            lbl_Index.Text = num.ToString();

            data = lines[num].Split('|');
            correct = data[0].Replace(" ", "%20");
            letter = data[data.Length - 1];
            label1.Text = correct;
            
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
        int num;
        string[] data;
        string correct;
        string letter;
        string[] lines;
        //67

        private void button2_Click(object sender, EventArgs e)
        {
           
            bool numB = Int32.TryParse(txb_ID.Text, out num);
            if (numB)
            {
                lines = System.IO.File.ReadAllLines(@"W:\TTM\scraper_scripts\newData\tbcS.txt");
                lbl_Index.Text = num.ToString();
               
                data = lines[num].Split('|');
                
                //splituje lose
                correct = data[0].Replace(" ","%20");
                //ZAMENI SPACE SA %20
                letter = data[data.Length - 1];
                label1.Text = data[0];
                num++;
                
                Process.Start("chrome.exe", $"https://www.google.com/search?q={correct}");
            }
            else
                MessageBox.Show("INVALID NUMBER");
        }

        private void label2_Click(object sender, EventArgs e)
        {
            
        }

        private void button3_Click(object sender, EventArgs e)
        {
            using (StreamWriter writer = new StreamWriter(@"E:\Nacional secret\Zemljopis\scraper_scripts\newData\data.txt", true))
            {
                string newD = "";
                for(int i = 0; i < data.Length-1; i++)
                {
                    newD += data[i] +"|";
                }
                newD += letter;
                writer.WriteLine(newD);
                num++;
                lbl_Index.Text = num.ToString();
                
                data = lines[num].Split('|');
                correct = data[0].Replace(" ", "%20");
                letter = data[data.Length - 1];
                label1.Text = data[0];
                Process.Start("chrome.exe", $"https://www.google.com/search?q={correct}");
            }
        }

        private void button4_Click(object sender, EventArgs e)
        {
            num++;
            lbl_Index.Text = num.ToString();

            data = lines[num].Split('|');
            correct = data[0].Replace(" ", "%20");
            letter = data[data.Length - 1];
            label1.Text = data[0];
            Process.Start("chrome.exe", $"https://www.google.com/search?q={correct}");
        }

        private void Form1_Load(object sender, EventArgs e)
        {
           
        }

        private void button5_Click(object sender, EventArgs e)
        {
            Process.Start("chrome.exe", $"https://www.google.com/search?q={correct}");
        }
    }
}
