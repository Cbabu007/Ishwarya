using PdfSharpCore.Fonts;
using System;
using System.IO;

public class TamilFontResolver : IFontResolver
{
    private readonly string fontPath;

    public TamilFontResolver(string fontPath)
    {
        this.fontPath = fontPath;
    }

    public byte[] GetFont(string faceName)
    {
        return File.ReadAllBytes(fontPath); // Load the TTF file
    }

    public FontResolverInfo ResolveTypeface(string familyName, bool isBold, bool isItalic)
    {
        return new FontResolverInfo("NotoTamil");
    }

    public string DefaultFontName => "NotoTamil"; // Implementing the missing interface member
}
